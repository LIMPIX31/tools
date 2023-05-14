import { isAbsolute, relative } from 'node:path'
import React, { FC, useMemo } from 'react'
import { Box } from 'ink'
import { ESLintResultMessage } from './eslint-result-message.component'
import type { ESLint } from 'eslint'
import { Project } from '@yarnpkg/core'

export interface ESLintResultProps {
  result: ESLint.LintResult
  project: Project
}

export const ESLintResult: FC<ESLintResultProps> = ({ result: { filePath, source, messages }, project }) => {
  const filepath = useMemo(() => {
    if (isAbsolute(filePath)) {
      return relative(process.cwd(), filePath)
    }

    return filePath
  }, [filePath])

  if (messages.length === 0) {
    return null
  }

  return (
    <Box flexDirection="column">
      {messages.map((message) => (
        <ESLintResultMessage
          project={project}
          key={`${message.ruleId}-${message.line}-${message.column}`}
          filePath={filepath}
          message={message}
          source={source}
        />
      ))}
    </Box>
  )
}
