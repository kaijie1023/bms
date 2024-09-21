import factory from '@adonisjs/lucid/factories'
import Book from '#models/book'

export const BookFactory = factory
  .define(Book, async ({ faker }) => {
    return {
      name: faker.lorem.words(5),
      author: faker.person.fullName(),
      isbn: faker.string.numeric(13),
      quantity: faker.number.int({ min: 1, max: 100 }),
      publisher: faker.company.name(),
      published_at: faker.date.anytime(),
    }
  })
  .build()