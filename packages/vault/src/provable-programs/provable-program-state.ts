/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} ProvableProgramStore
 */

export type SingleProvableProgramState = {
  program: unknown // TODO: add o1js and example program to define this type
  vericiationKey: string
}

export type ProgramName = string

export type ProvableProgramState = {
  programs: Record<ProgramName, SingleProvableProgramState>
}

export type ProvableProgramActions = {
  getProvableProgram: (
    programName: ProgramName
  ) => ProvableProgramState | undefined
  setProvableProgram: (
    programName: ProgramName,
    state: ProvableProgramState
  ) => void
  removeProvableProgram: (programName: ProgramName) => void
  allProvablePrograms: () => (ProvableProgramState | undefined)[]
  clear: () => void
}

export type ProvableProgramStore = ProvableProgramState & ProvableProgramActions
