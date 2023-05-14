/* eslint-disable react/no-array-index-key */

import { parse } from '@atls/stack-trace'
import React, { FC, useMemo } from 'react'
import { Box, Spacer, Text } from 'ink'
import { SourceFrame } from '@lmpx-cli/source-frame-component'
import { getFrameSource } from './utils'

export interface StackTraceProps {
  children: string
}

export const StackTrace: FC<StackTraceProps> = ({ children }) => {
  const stack = useMemo(() => parse(children), [children])
  const source = useMemo(() => (stack?.topFrame ? getFrameSource(stack.topFrame) : null), [stack])

  if (!stack) {
    return null
  }

  return (
    <Box flexDirection="column" flexGrow={1}>
      {source && stack?.topFrame?.line && (
        <Box>
          <SourceFrame line={stack?.topFrame?.line} column={stack?.topFrame?.column}>
            {source}
          </SourceFrame>
        </Box>
      )}
      {stack.frames.map((frame: any, index) => (
        <Box key={`${frame.file}-${frame.line}-${frame.column}-${index}`} justifyContent="flex-end">
          <Text>{frame.function}</Text>
          <Spacer/>
          <Text color="gray">{frame.file}</Text>
          {frame.line && <Text color="gray">:{frame.line}</Text>}
          {frame.column && <Text color="gray">:{frame.column}</Text>}
        </Box>
      ))}
    </Box>
  )
}
