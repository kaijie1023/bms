import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Book from '#models/book'

export default class extends BaseSeeder {
  async run() {
    await Book.createMany([
      {
        name: 'The Infinite Loop',
        author: 'Michael Rogers',
        isbn: '978-3-16-148410-0',
        quantity: 5,
        publisher: 'Tech Books Publishing',
        published_at: new Date('2021-08-15')
      },
      {
        name: 'Shadows of the Mind',
        author: 'Sophia Carter',
        isbn: '978-1-86197-876-9',
        quantity: 2,
        publisher: 'MindWorks Press',
        published_at:  new Date('2020-03-12')
      },
      {
        name: 'Echoes of Tomorrow',
        author: 'Nathan Green',
        isbn: '978-0-14-312854-0',
        quantity: 10,
        publisher: 'FutureScape Media',
        published_at:  new Date('2019-11-05')
      },
      {
        name: 'Whispers of the Forest',
        author: 'Olivia Hart',
        isbn: '978-0-06-123456-7',
        quantity: 7,
        publisher: 'Nature\'s Whisper',
        published_at:  new Date('2022-07-21')
      },
      {
        name: 'The Last Horizon',
        author: 'Liam Stone',
        isbn: '978-0-7432-7356-5',
        quantity: 4,
        publisher: 'Horizon Publishing',
        published_at:  new Date('2023-01-18')
      }
    ])
  }
}