import React, { type FC, useMemo } from 'react'
import { TypescriptDiagnosticProps } from './typescript-diagnostic.interface'
import Box from 'ink/build/components/Box'
import { getLineAndCharacterOfPosition, flattenDiagnosticMessageText } from '@lmpx/code-typescript'
import { isAbsolute, relative } from 'node:path'
import Text from 'ink/build/components/Text'
import { SourceFrame } from '@lmpx/cli-source-frame-component'

export const TypescriptDiagnostic: FC<TypescriptDiagnosticProps> = ({ diagnostic, project }) => {
  const file = useMemo(() => diagnostic.file, [diagnostic])

  const filepath = useMemo(() => {
    if (!file) {
      return null
    }

    if (isAbsolute(file.fileName)) {
      return relative(process.cwd(), file?.fileName)
    }

    return file.fileName
  }, [file])

  const position = useMemo(() => {
    if (file?.lineMap && diagnostic.start) {
      return getLineAndCharacterOfPosition(file, diagnostic.start!)
    }

    return null
  }, [diagnostic])

  const workspace = useMemo(() => {
    if (!filepath) {
      return null
    }

    return project.getWorkspaceByFilePath(filepath)
  }, [project])

  const workspaceName = useMemo(({ scope, name } = workspace.manifest.name ?? {}) => {
    if (!name) {
      return null
    }

    return scope ? `@${scope}/${name}` : name
  }, [workspace])

  const filepathInWorkspace = useMemo(() => {
    if (!workspace || !filepath) {
      return null
    }

    const relativePath = relative(workspace.cwd, filepath)

    return relativePath.replace(/^src[/\\]/, '')
  }, [workspace])

  return (
    <Box marginTop={1} flexDirection='column'>
      <Box flexDirection='row'>
        <Text bold color='cyan'>Workspace: </Text>
        <Text bold color='white'>{workspaceName ?? '<Unknown>'}</Text>
      </Box>
      {filepathInWorkspace && (
        <Box flexDirection='row'>
          <Text bold color='cyan'>At: </Text>
          <Text color='greenBright'>
            {filepathInWorkspace ?? ''}
            {position ? `:${position.line}:${position.character}` : ''}
          </Text>
        </Box>
      )}
      <Box marginBottom={1}>
        <Text bold color='red'>Error: </Text>
        <Text color='white'>{flattenDiagnosticMessageText(diagnostic.messageText, '\n')}</Text>
      </Box>
      {file?.text && position && (
        <SourceFrame line={position.line + 1} column={position.character}>
          {file.text}
        </SourceFrame>
      )}
    </Box>
  )
}
