export type Note = {
  id: string
  archivedAt: Date | null
}

export function restoreNote(note: Note): Note {
  return { ...note, archivedAt: null }
}
