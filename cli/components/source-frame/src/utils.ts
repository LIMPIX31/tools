import { codeFrameColumns } from '@babel/code-frame'
import supportsColor from 'supports-color'

export const forceColor = Boolean(supportsColor.stdout?.['has256'])

export const codeFrameSource = (source, line: number, column?: number) =>
  codeFrameColumns(source, { start: { column, line } }, { highlightCode: forceColor, forceColor })
