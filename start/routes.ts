/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const SessionController = () => import('#controllers/session_controller')
const BookController = () => import('#controllers/book_controller')


router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('signin', [SessionController, 'signIn'])

router
  .group(() => {
    router.get('books', [BookController, 'index'])
    router.post('books', [BookController, 'store'])
    router.get('books/:id', [BookController, 'show'])
    router.put('books/:id', [BookController, 'update'])
    router.delete('books/:id', [BookController, 'destroy'])
  })
  .use(middleware.auth({
    guards: ['api']
  }))
