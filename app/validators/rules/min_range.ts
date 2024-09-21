import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type Options = {
  minField: string
}

function minRange(value: unknown, options: Options, field: FieldContext) {
  if (typeof value !== 'number') {
    return
  }

  if (value < field.data.quantityMin) {
    field.report(
      `The {{ field }} field must not smaller that ${options.minField}`,
      'minRage',
      field
    )
  }
}

export const minRangeRule = vine.createRule(minRange)
