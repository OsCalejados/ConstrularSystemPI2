import { z } from 'zod'

export const notesFormSchema = z.object({
  notes: z.string(),
})
