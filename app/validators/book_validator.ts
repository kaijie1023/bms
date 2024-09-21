import vine from '@vinejs/vine'
import { minRangeRule } from '#validators/rules/min_range'

export const listBookValidator = vine.compile(
  vine.object({
    quantityMin: vine.number().positive().optional(),
    quantityMax: vine
      .number()
      .positive()
      .optional()
      .use(minRangeRule({ minField: 'quantityMin' })),
    sort: vine.enum(['name', 'quantity', 'published_at']).optional(),
    sortDir: vine.enum(['asc', 'desc']).optional(),
  })
)

/**
 * Validates the book's creation action
 */
export const createBookValidator = vine.compile(
  vine.object({
    name: vine.string(),
    author: vine.string(),
    isbn: vine.string().unique(async (db, value) => {
      const book = await db.from('books').where('isbn', value).first()
      return !book
    }),
    quantity: vine.number().positive(),
    publisher: vine.string(),
    published_at: vine.date(),
  })
)

/**
 * Validates the book's update action
 */
export const updateBookValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    author: vine.string().optional(),
    isbn: vine
      .string()
      .unique(async (db, value, field) => {
        const book = await db
          .from('books')
          .where('isbn', value)
          .andWhereNot('id', field.data.params.id)
          .first()
        return !book
      })
      .optional(),
    quantity: vine.number().positive().optional(),
    publisher: vine.string().optional(),
    published_at: vine.date().optional(),
  })
)
