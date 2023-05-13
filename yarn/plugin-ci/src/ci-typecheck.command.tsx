import React from 'react'
import { EOL } from 'node:os'
import { BaseCommand } from '@yarnpkg/cli'
import { Configuration, MessageName, Project, StreamReport } from '@yarnpkg/core'
import { PortablePath, ppath, xfs } from '@yarnpkg/fslib'
import { codeFrameColumns } from '@babel/code-frame'
import { TypescriptDiagnostic } from '@lmpx-cli/typescript-diagnostic-component'
import { run } from '@lmpx-code/typescript-worker'
import { renderStatic } from '@lmpx-cli/renderer'
import { flattenDiagnosticMessageText, getLineAndCharacterOfPosition } from '@lmpx-code/typescript'
import { Annotation, AnnotationLevel, GitHubChecks } from './github.checks'

class CiTypecheckCommand extends BaseCommand {
  static paths = [['ci', 'typecheck']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        const tsconfigPath = ppath.join(project.cwd, 'tsconfig.json')

        if (!await xfs.existsPromise(tsconfigPath)) {
          report.reportError(MessageName.UNNAMED, 'Tsconfig is not exists')
          return
        }

        const tsconfig = await xfs.readFilePromise(tsconfigPath, 'utf8').then(JSON.parse)

        await report.startTimerPromise('Typecheck', async () => {
          const checks = new GitHubChecks('Typecheck')

          const { id: checkId } = await checks.start()

          try {
            const diagnostics = await run({
              cwd: project.cwd,
              include: project.topLevelWorkspace.manifest.workspaceDefinitions.map(
                (definition) => definition.pattern,
              ),
              tsconfig
            })

            diagnostics.forEach((diagnostic) => {
              const output = renderStatic(<TypescriptDiagnostic diagnostic={diagnostic} project={project} />)

              output.split('\n').forEach((line) => report.reportInfo(MessageName.UNNAMED, line))
            })

            const annotations: Array<Annotation> = []

            diagnostics.forEach((diagnostic) => {
              if (diagnostic.file) {
                const position =
                  (diagnostic.file as any).lineMap && diagnostic.start
                    ? getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start)
                    : null

                annotations.push({
                  path: ppath.normalize(
                    ppath.relative(project.cwd, diagnostic.file.fileName as PortablePath),
                  ),
                  title: flattenDiagnosticMessageText(diagnostic.messageText, EOL)
                    .split(EOL)
                    .at(0) as string,
                  message: flattenDiagnosticMessageText(diagnostic.messageText, EOL),
                  start_line: position ? position.line + 1 : 0,
                  end_line: position ? position.line + 1 : 0,
                  raw_details: position
                    ? codeFrameColumns(
                      xfs.readFileSync(diagnostic.file.fileName as PortablePath).toString(),
                      {
                        start: {
                          line: position.line + 1,
                          column: position.character + 1,
                        },
                      },
                      { highlightCode: false },
                    )
                    : flattenDiagnosticMessageText(diagnostic.messageText, EOL),
                  annotation_level: AnnotationLevel.Failure,
                })
              }
            })

            await checks.complete(checkId, {
              title: diagnostics.length > 0 ? `Errors ${annotations.length}` : 'Successful',
              summary:
                diagnostics.length > 0 ? `Found ${annotations.length} errors` : 'All checks passed',
              annotations,
            })
          } catch (error) {
            await checks.failure({
              title: 'Typecheck run failed',
              summary: (error as any).message,
            })
          }
        })
      },
    )

    return commandReport.exitCode()
  }
}

export { CiTypecheckCommand }
