import { test } from '@japa/runner'

import User from '#models/user'
import Book from '#models/book'
import { UserFactory } from '#database/factories/user_factory'

test.group('Book index', (group) => {
  let user: User

  group.setup(async () => {
    user = await UserFactory.create()

    await Book.createMany([
      {
        name: 'The Infinite Loop',
        author: 'Michael Rogers',
        isbn: '978-3-16-148410-0',
        quantity: 5,
        publisher: 'Tech Books Publishing',
        published_at: new Date('2021-08-15'),
      },
      {
        name: 'Shadows of the Horizon Mind',
        author: 'Sophia Carter',
        isbn: '978-1-86197-876-9',
        quantity: 2,
        publisher: 'MindWorks Press',
        published_at: new Date('2020-03-12'),
      },
      {
        name: 'Echoes of Tomorrow',
        author: 'Nathan Green',
        isbn: '978-0-14-312854-0',
        quantity: 10,
        publisher: 'FutureScape Media',
        published_at: new Date('2019-11-05'),
      },
      {
        name: 'Whispers of the Forest',
        author: 'Olivia Hart',
        isbn: '978-0-06-123456-7',
        quantity: 7,
        publisher: `"Nature's Whisper"`,
        published_at: new Date('2022-07-21'),
      },
      {
        name: 'The Last Horizon',
        author: 'Liam Stone',
        isbn: '978-0-7432-7356-5',
        quantity: 4,
        publisher: 'Horizon Publishing',
        published_at: new Date('2023-01-18'),
      },
    ])
  })

  group.teardown(async () => {
    await Book.query().delete()
  })

  test('list all', async ({ client, assert }) => {
    const response = await client.get('/books').loginAs(user)

    assert.equal(response.body().length, 5)
    assert.equal(response.status(), 200)
  })

  test('name filter', async ({ client, assert }) => {
    const response = await client.get('/books?name=horizon').loginAs(user)

    const body = response.body()
    assert.equal(body.length, 2)
    body.forEach((book: Book) => {
      assert.match(book.name.toLowerCase(), /horizon/)
    })
    assert.equal(response.status(), 200)
  })

  test('author filter', async ({ client, assert }) => {
    const response = await client.get('/books?author=Michael').loginAs(user)

    const body = response.body()
    assert.equal(body.length, 1)
    body.forEach((book: Book) => {
      assert.match(book.author.toLowerCase(), /michael/)
    })
    assert.equal(response.status(), 200)
  })

  test('isbn filter', async ({ client, assert }) => {
    const response = await client.get('/books?isbn=78-0').loginAs(user)

    const body = response.body()
    assert.equal(body.length, 3)
    body.forEach((book: Book) => {
      assert.match(book.isbn, /78-0/)
    })
    assert.equal(response.status(), 200)
  })

  test('quantity range filter', async ({ client, assert }) => {
    const response = await client.get('/books?quantityMin=7&quantityMax=11').loginAs(user)

    const body = response.body()
    assert.equal(body.length, 2)
    body.forEach((book: Book) => {
      assert.isAbove(book.quantity, 6)
      assert.isBelow(book.quantity, 12)
    })
    assert.equal(response.status(), 200)
  })

  test('quantityMin greater than quantityMax', async ({ client, assert }) => {
    const response = await client.get('/books?quantityMin=10&quantityMax=1').loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(
      response.body().errors[0].message,
      'The quantityMax field must not smaller that quantityMin'
    )
  })

  test('quantityMin less than 0', async ({ client, assert }) => {
    const response = await client.get('/books?quantityMin=-1').loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The quantityMin field must be positive')
  })

  test('quantityMax less than 0', async ({ client, assert }) => {
    const response = await client.get('/books?quantityMax=-1').loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The quantityMax field must be positive')
  })

  test('sort name asc', async ({ client, assert }) => {
    const response = await client.get('/books?sort=name&sortDir=asc').loginAs(user)

    const body = response.body()
    assert.equal(response.status(), 200)
    assert.equal(body[0].name, 'Echoes of Tomorrow')
    assert.equal(body[1].name, 'Shadows of the Horizon Mind')
    assert.equal(body[2].name, 'The Infinite Loop')
    assert.equal(body[3].name, 'The Last Horizon')
    assert.equal(body[4].name, 'Whispers of the Forest')
  })

  test('sort name desc', async ({ client, assert }) => {
    const response = await client.get('/books?sort=name&sortDir=desc').loginAs(user)

    const body = response.body()
    assert.equal(response.status(), 200)
    assert.equal(body[0].name, 'Whispers of the Forest')
    assert.equal(body[1].name, 'The Last Horizon')
    assert.equal(body[2].name, 'The Infinite Loop')
    assert.equal(body[3].name, 'Shadows of the Horizon Mind')
    assert.equal(body[4].name, 'Echoes of Tomorrow')
  })

  test('sort quantity asc', async ({ client, assert }) => {
    const response = await client.get('/books?sort=quantity&sortDir=asc').loginAs(user)

    const body = response.body()
    assert.equal(response.status(), 200)
    assert.equal(body[0].quantity, 2)
    assert.equal(body[1].quantity, 4)
    assert.equal(body[2].quantity, 5)
    assert.equal(body[3].quantity, 7)
    assert.equal(body[4].quantity, 10)
  })

  test('sort quantity desc', async ({ client, assert }) => {
    const response = await client.get('/books?sort=quantity&sortDir=desc').loginAs(user)

    const body = response.body()
    assert.equal(response.status(), 200)
    assert.equal(body[0].quantity, 10)
    assert.equal(body[1].quantity, 7)
    assert.equal(body[2].quantity, 5)
    assert.equal(body[3].quantity, 4)
    assert.equal(body[4].quantity, 2)
  })

  test('sort publised_at asc', async ({ client, assert }) => {
    const response = await client.get('/books?sort=published_at&sortDir=asc').loginAs(user)

    const body = response.body()
    assert.equal(response.status(), 200)
    assert.equal(body[0].publishedAt, new Date('2019-11-05').toISOString())
    assert.equal(body[0].publishedAt, new Date('2019-11-05').toISOString())
    assert.equal(body[1].publishedAt, new Date('2020-03-12').toISOString())
    assert.equal(body[2].publishedAt, new Date('2021-08-15').toISOString())
    assert.equal(body[3].publishedAt, new Date('2022-07-21').toISOString())
    assert.equal(body[4].publishedAt, new Date('2023-01-18').toISOString())
  })

  test('sort publised_at desc', async ({ client, assert }) => {
    const response = await client.get('/books?sort=published_at&sortDir=desc').loginAs(user)

    const body = response.body()
    assert.equal(response.status(), 200)
    assert.equal(body[0].publishedAt, new Date('2023-01-18').toISOString())
    assert.equal(body[1].publishedAt, new Date('2022-07-21').toISOString())
    assert.equal(body[2].publishedAt, new Date('2021-08-15').toISOString())
    assert.equal(body[3].publishedAt, new Date('2020-03-12').toISOString())
    assert.equal(body[4].publishedAt, new Date('2019-11-05').toISOString())
  })

  test('invalid sort', async ({ client, assert }) => {
    const response = await client.get('/books?sort=book_name&sortDir=asc').loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The selected sort is invalid')
  })

  test('invalid sortDir', async ({ client, assert }) => {
    const response = await client.get('/books?sort=name&sortDir=ascending').loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The selected sortDir is invalid')
  })
})

test.group('Book store', (group) => {
  let user: User

  group.setup(async () => {
    user = await UserFactory.create()
  })

  group.teardown(async () => {
    await Book.query().delete()
  })

  test('store book', async ({ client, assert }) => {
    const json = {
      name: 'The Infinite Loop',
      author: 'Michael Rogers',
      isbn: '978-3-16-148410-0',
      quantity: 5,
      publisher: 'Tech Books Publishing',
      published_at: '2021-08-15',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 200)
    assert.exists(response.body().id)

    const storedBook = await Book.find(response.body().id)
    assert.equal(storedBook?.name, json.name)
    assert.equal(storedBook?.author, json.author)
    assert.equal(storedBook?.isbn, json.isbn)
    assert.equal(storedBook?.quantity, json.quantity)
    assert.equal(storedBook?.publisher, json.publisher)
    assert.equal(storedBook?.published_at.getTime, new Date(json.published_at).getTime)
  })

  test('missing name', async ({ client, assert }) => {
    const json = {
      author: 'Michael Rogers',
      isbn: '978-3-16-148410-0',
      quantity: 5,
      publisher: 'Tech Books Publishing',
      published_at: '2021-08-15',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The name field must be defined')
  })

  test('missing author', async ({ client, assert }) => {
    const json = {
      name: 'Shadows of the Mind',
      isbn: '978-1-86197-876-9',
      quantity: 2,
      publisher: 'MindWorks Press',
      published_at: '2020-03-12',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The author field must be defined')
  })

  test('missing isbn', async ({ client, assert }) => {
    const json = {
      name: 'Echoes of Tomorrow',
      author: 'Nathan Green',
      quantity: 10,
      publisher: 'FutureScape Media',
      published_at: '2019-11-05',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The isbn field must be defined')
  })

  test('missing quantity', async ({ client, assert }) => {
    const json = {
      name: 'Whispers of the Forest',
      author: 'Olivia Hart',
      isbn: '978-0-06-123456-7',
      publisher: `"Nature's Whisper"`,
      published_at: '2022-07-21',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The quantity field must be defined')
  })

  test('missing publisher', async ({ client, assert }) => {
    const json = {
      name: 'The Last Horizon',
      author: 'Liam Stone',
      isbn: '978-0-7432-7356-5',
      quantity: 4,
      published_at: '2023-01-18',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The publisher field must be defined')
  })

  test('missing published_at', async ({ client, assert }) => {
    const json = {
      name: 'Echoes of Tomorrow',
      author: 'Nathan Green',
      isbn: '978-0-14-312854-0',
      quantity: 10,
      publisher: 'FutureScape Media',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The published_at field must be defined')
  })

  test('negative quantity', async ({ client, assert }) => {
    const json = {
      name: 'The Last Horizon',
      author: 'Liam Stone',
      isbn: '978-0-7432-7356-5',
      quantity: -1,
      publisher: 'Penguin Books',
      published_at: '2023-01-18',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The quantity field must be positive')
  })

  test('invalid published_at', async ({ client, assert }) => {
    const json = {
      name: 'The Last Horizon',
      author: 'Liam Stone',
      isbn: '978-0-7432-7356-5',
      quantity: 4,
      publisher: 'Penguin Books',
      published_at: 'abc',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(
      response.body().errors[0].message,
      'The published_at field must be a datetime value'
    )
  })

  test('duplicate isbn', async ({ client, assert }) => {
    const json = {
      name: 'The Last Horizon',
      author: 'Liam Stone',
      isbn: '978-3-16-148410-0',
      quantity: 4,
      publisher: 'Penguin Books',
      published_at: '2023-01-18',
    }
    const response = await client.post('/books').json(json).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The isbn has already been taken')
  })
})

test.group('Book show', (group) => {
  let user: User
  let bookId: number
  const json = {
    name: 'The Infinite Loop',
    author: 'Michael Rogers',
    isbn: '978-3-16-148410-0',
    quantity: 5,
    publisher: 'Tech Books Publishing',
    published_at: new Date('2021-08-15'),
  }

  group.setup(async () => {
    user = await UserFactory.create()
    const book = await Book.create(json)
    bookId = book.id
  })

  group.teardown(async () => {
    await Book.query().delete()
  })

  test('show book', async ({ client, assert }) => {
    const response = await client.get(`/books/${bookId}`).loginAs(user)

    assert.equal(response.status(), 200)
    assert.equal(response.body().id, bookId)
    assert.equal(response.body().name, json.name)
    assert.equal(response.body().author, json.author)
    assert.equal(response.body().isbn, json.isbn)
    assert.equal(response.body().quantity, json.quantity)
    assert.equal(response.body().publisher, json.publisher)
    assert.equal(response.body().publishedAt, new Date(json.published_at).toISOString())
  })

  test('invalid book id', async ({ client, assert }) => {
    const response = await client.get('/books/9999999').loginAs(user)

    assert.equal(response.status(), 404)
    assert.equal(response.body().message, 'Row not found')
  })
})

test.group('Book update', (group) => {
  let user: User
  let bookId: number
  const json = {
    name: 'Shadows of the Mind',
    author: 'Sophia Carter',
    isbn: '978-1-86197-876-9',
    quantity: 2,
    publisher: 'MindWorks Press',
    published_at: new Date('2020-03-12'),
  }

  group.setup(async () => {
    user = await UserFactory.create()
    const book = await Book.create(json)
    bookId = book.id
  })

  group.teardown(async () => {
    await Book.query().delete()
  })

  test('update book name', async ({ client, assert }) => {
    const response = await client.put(`/books/${bookId}`).json({ name: 'New Book' }).loginAs(user)

    assert.equal(response.status(), 200)
    assert.equal(response.body().name, 'New Book')
  })

  test('update book author', async ({ client, assert }) => {
    const response = await client.put(`/books/${bookId}`).json({ author: 'John Doe' }).loginAs(user)

    assert.equal(response.status(), 200)
    assert.equal(response.body().author, 'John Doe')
  })

  test('update book isbn', async ({ client, assert }) => {
    const response = await client
      .put(`/books/${bookId}`)
      .json({ isbn: '978-1-86197-876-1' })
      .loginAs(user)

    assert.equal(response.status(), 200)
    assert.equal(response.body().isbn, '978-1-86197-876-1')
  })

  test('update book quantity', async ({ client, assert }) => {
    const response = await client.put(`/books/${bookId}`).json({ quantity: 10 }).loginAs(user)

    assert.equal(response.status(), 200)
    assert.equal(response.body().quantity, 10)
  })

  test('update book publisher', async ({ client, assert }) => {
    const response = await client
      .put(`/books/${bookId}`)
      .json({ publisher: 'Tech Books Publishing' })
      .loginAs(user)

    assert.equal(response.status(), 200)
    assert.equal(response.body().publisher, 'Tech Books Publishing')
  })

  test('update book published_at', async ({ client, assert }) => {
    const response = await client
      .put(`/books/${bookId}`)
      .json({ published_at: '2020-03-12' })
      .loginAs(user)

    assert.equal(response.status(), 200)
    assert.equal(response.body().publishedAt, '2020-03-12')
  })

  test('invalid book id', async ({ client, assert }) => {
    const response = await client.put('/books/9999999').json({ name: 'New Book' }).loginAs(user)

    assert.equal(response.status(), 404)
    assert.equal(response.body().message, 'Row not found')
  })

  test('duplicate isbn', async ({ client, assert }) => {
    await Book.create({ ...json, isbn: '111-1-11111-111-1' })
    const response = await client
      .put(`/books/${bookId}`)
      .json({ isbn: '111-1-11111-111-1' })
      .loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The isbn has already been taken')
  })

  test('negative quantity', async ({ client, assert }) => {
    const response = await client.put(`/books/${bookId}`).json({ quantity: -1 }).loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'The quantity field must be positive')
  })

  test('invalid published_at', async ({ client, assert }) => {
    const response = await client
      .put(`/books/${bookId}`)
      .json({ published_at: 'abc' })
      .loginAs(user)

    assert.equal(response.status(), 422)
    assert.equal(
      response.body().errors[0].message,
      'The published_at field must be a datetime value'
    )
  })
})

test.group('Book delete', (group) => {
  let user: User
  let bookId: number
  const json = {
    name: 'Echoes of Tomorrow',
    author: 'Nathan Green',
    isbn: '978-0-14-312854-0',
    quantity: 10,
    publisher: 'FutureScape Media',
    published_at: new Date('2019-11-05'),
  }

  group.setup(async () => {
    user = await UserFactory.create()
    const book = await Book.create(json)
    bookId = book.id
  })

  group.teardown(async () => {
    await Book.query().delete()
  })

  test('delete book', async ({ client, assert }) => {
    const response = await client.delete(`/books/${bookId}`).loginAs(user)

    assert.equal(response.status(), 200)
  })

  test('invalid book id', async ({ client, assert }) => {
    const response = await client.delete('/books/9999999').loginAs(user)

    assert.equal(response.status(), 404)
    assert.equal(response.body().message, 'Row not found')
  })
})
