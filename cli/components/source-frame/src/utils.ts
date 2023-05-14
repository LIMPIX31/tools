import { codeFrameColumns } from '@babel/code-frame'
import supportsColor from 'supports-color'

export const forceColor = supportsColor.stdout ? Reflect.has(supportsColor.stdout, 'has256') : false

export const codeFrameSource = (source, line: number, column?: number) =>
  codeFrameColumns(source, { start: { column, line } }, { highlightCode: forceColor, forceColor })
