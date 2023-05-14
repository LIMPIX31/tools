import type { FC } from 'react'
import React, { useMemo } from 'react'
import Text from 'ink/build/components/Text'
import Box from 'ink/build/components/Box'
import type { Linter } from 'eslint'
import { SourceFrame } from '@lmpx-cli/source-frame-component'
import { Project } from '@yarnpkg/core'
import type { PortablePath } from '@yarnpkg/fslib'
import { relative } from 'node:path'

export interface ESLintResultMessageProps {
  message: Linter.LintMessage
  source?: string
  filePath: string
  project: Project
}

export const ESLintResultMessage: FC<ESLintResultMessageProps> = ({
  filePath,
  message,
  source,
  project,
}) => {
  const workspace = useMemo(() => project.getWorkspaceByFilePath(filePath as PortablePath), [project, filePath])

  const workspaceName = useMemo(({ scope, name } = workspace?.manifest?.name ?? {} as any) => {
    if (!name) {
      return null
    }

    return scope ? `@${scope}/${name}` : name
  }, [workspace])

  const filepathInWorkspace = useMemo(() => {
    if (!workspace || !filePath) {
      return null
    }

    const relativePath = relative(workspace.cwd, filePath)

    return relativePath.replace(/^src[/\\]/, '')
  }, [workspace, filePath])

  return (
    <Box marginTop={1} flexDirection="column">
      <Box flexDirection="row">
        <Text bold color="cyan">Workspace: </Text>
        <Text bold color="white">{workspaceName ?? '<Unknown>'}</Text>
      </Box>
      <Box flexDirection='row'>
        <Text bold color='cyan'>At: </Text>
        <Text color='greenBright'>
          {filepathInWorkspace ?? ''}
          {`:${message.line}:${message.column}`}
        </Text>
      </Box>
      {message.ruleId && (
        <Box>
          <Text bold color='cyan'>Rule: </Text>
          <Text color='gray'>{message.ruleId}</Text>
        </Box>
      )}
      <Box marginBottom={1}>
       <Text bold color={message.severity === 1 ? 'yellow' : 'red'}>{message.severity === 1 ? 'Warning' : 'Error'}: </Text>
       <Text color='white'>{message.message}</Text>
      </Box>
      {source && (
        <SourceFrame line={message.line} column={message.column}>
          {source}
        </SourceFrame>
      )}
    </Box>
  )
}
