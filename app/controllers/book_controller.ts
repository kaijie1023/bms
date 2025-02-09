import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import Book from '#models/book'
import {
  listBookValidator,
  createBookValidator,
  updateBookValidator,
} from '#validators/book_validator'

export default class BookController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    await request.validateUsing(listBookValidator)

    const { name, author, isbn, quantityMin, quantityMax, sort, sortDir } = request.qs()

    return await Book.query()
      .if(name, (query) => {
        query.where('name', 'like', `%${name}%`)
      })
      .if(author, (query) => {
        query.where('author', 'like', `%${author}%`)
      })
      .if(isbn, (query) => {
        query.where('isbn', 'like', `%${isbn}%`)
      })
      .if(quantityMin, (query) => {
        query.where('quantity', '>=', quantityMin)
      })
      .if(quantityMax, (query) => {
        query.where('quantity', '<=', quantityMax)
      })
      .if(sort, (query) => {
        query.orderBy(sort, sortDir)
      })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    await request.validateUsing(createBookValidator)

    const book = new Book()
    await book.fill(request.all()).save()
    return book
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const bookId = params.id

    // Check if the book is cached
    let cachedBook = await redis.get(`book_${bookId}`)
    if (cachedBook) {
      return JSON.parse(cachedBook)
    }

    const book = await Book.findOrFail(params.id)
    await redis.set(`book_${bookId}`, JSON.stringify(book))
    return book
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    await request.validateUsing(updateBookValidator)

    const book = await Book.findOrFail(params.id)
    await book.merge(request.all()).save()
    return book
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const book = await Book.findOrFail(params.id)
    await book.delete()
  }
}
