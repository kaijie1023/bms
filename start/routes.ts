/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const BooksController = () => import('#controllers/books_controller')


router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('books', [BooksController, 'index'])
router.post('books', [BooksController, 'store'])
router.get('books/:id', [BooksController, 'show'])
router.put('books/:id', [BooksController, 'update'])
router.delete('books/:id', [BooksController, 'destroy'])