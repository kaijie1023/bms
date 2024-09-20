import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import LogService from '#services/user_log_service'

export default class UserLogMiddleware {
  async handle({ auth, request }: HttpContext, next: NextFn) {
    const output = await next()

    const user = auth.user
    const action = `${request.method()}: ${request.url()}`
    const details = JSON.stringify(request.all())

    if (user) {
      await LogService.logAction(user.id, action, details)
    }

    return output
  }
}