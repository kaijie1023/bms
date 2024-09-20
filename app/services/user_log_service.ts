import UserLog from '#models/user_log'

class LogService {
  public async logAction(userId: number, action: string, details: string) {
    await UserLog.create({
      userId,
      action,
      details,
    })
  }
}

export default new LogService();
