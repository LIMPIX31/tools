import React, { FC } from 'react'
import Box from 'ink/build/components/Box'
import Text from 'ink/build/components/Text'
import { StackTrace } from '@lmpx-cli/stack-trace-component'

export interface ErrorProps {
  error: Error
}

export const ErrorMessage = ({ children }) => {
  if (!children) {
    return null
  }

  return (
    <Box marginBottom={1}>
      <Text color="red" bold>
        {children}
      </Text>
    </Box>
  )
}

export const ErrorInfo: FC<ErrorProps> = ({ error }) => (
  <Box flexDirection="column">
    <ErrorMessage>{error.message}</ErrorMessage>
    {error.stack && (
      <Box>
        <StackTrace>{error.stack}</StackTrace>
      </Box>
    )}
  </Box>
)
