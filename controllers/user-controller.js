const { validationResult } = require("express-validator")
const userService = require("../services/user-service")

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        throw new Error("Ошибка регистрации")
      }

      const { name, password, email, captcha } = req.body

      // console.log(captcha, req.session.captcha)

      const userData = await userService.registration(name, password, email, req.session.captcha, captcha)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password, captcha } = req.body

      const userData = await userService.login(email, password, req.session.captcha, captcha)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      console.log(userData)
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }


  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const tokenData = await userService.refresh(refreshToken)
      res.cookie("refreshToken", tokenData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return res.json(tokenData)
    } catch (e) {
      next(e)
    }
  }

  async captcha(req, res, next) {
    try {
      const captchaData = await userService.captcha()
      req.session.captcha = captchaData.text;
      res.type('svg');
      console.log(req.session)
      return res.json(captchaData.data)
    } catch (e) {
      next(e)
    }
  }

  async resolveCaptcha(req, res, next) {
    try {
      const { captcha } = req.body

      const captchaData = await userService.resolveCaptcha(captcha)

      return res.json(captchaData)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()