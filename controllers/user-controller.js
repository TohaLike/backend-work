const { validationResult } = require("express-validator")
const userService = require("../services/user-service")

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        throw new Error("Ошибка регистрации")
      }

      const { name, password, email } = req.body

      const userData = await userService.registration(name, password, email)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

}

module.exports = new UserController()