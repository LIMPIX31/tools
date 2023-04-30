import { Diagnostic } from 'typescript'
import { Project } from '@yarnpkg/core'

export interface TypescriptDiagnosticProps {
  diagnostic: Diagnostic
  project: Project
}
