import React, { type FC } from 'react'
import Text from 'ink/build/components/Text'
import { codeFrameSource } from './utils'

export interface SourcePreviewProps {
  children: string
  line: number
  column?: number
}

export const SourceFrame: FC<SourcePreviewProps> = ({ children, line, column }) => (
  <Text>{codeFrameSource(children, line, column)}</Text>
)
