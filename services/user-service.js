const bcrypt = require("bcrypt")
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const { models: { User } } = require("../models")
const ApiError = require("../exceptions/api-error")
const svgCaptcha = require("svg-captcha")
const TwoCaptcha = require("@2captcha/captcha-solver")
const solver = new TwoCaptcha.Solver(process.env.TWO_CAPTCHA_API)
const sharp = require('sharp');

class UserService {
  сaptchaCode = ""

  async registration(name, password, email, sessionCaptcha, captcha) {
    const candidate = await User.findOne({ where: { email } })

    if (candidate) throw ApiError.BadRequest(`Пользователь с таким email адресом '${email}' уже есть`)

    console.log(sessionCaptcha, captcha)

    if (sessionCaptcha !== captcha) throw ApiError.BadRequest("Не правильный код с картинки")

    const hashPassword = await bcrypt.hash(password, 3)

    const user = await User.create({ name, password: hashPassword, email })

    const userDto = new UserDto(user.dataValues)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async login(email, password, sessionCaptcha, captcha) {
    const userData = await User.findOne({ where: { email } })

    console.log(sessionCaptcha, captcha)

    if (!userData) throw ApiError.BadRequest(`Пользователь с таким email адресом ${email} не зарегистрирован`)

    if (sessionCaptcha !== captcha) throw ApiError.BadRequest("Не правильный код с картинки")

    const isEqualPassword = await bcrypt.compare(password, userData.password)

    if (!isEqualPassword) throw ApiError.BadRequest("Неверный пароль")

    const userDto = new UserDto(userData)

    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }


  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.UnauthorizedError()

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()

    const user = await User.findOne({ where: { id: userData.id } })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }


  async captcha() {
    const captcha = svgCaptcha.create({
      size: 6,
      ignoreChars: 'iLl10I',
      noise: 1,
      color: true,
    });

    return captcha;
  }

  // async resolveCaptcha(captcha) {
  //   const svgBuffer = Buffer.from(captcha.split(',')[1], 'base64');

  //   const pngBuffer = await sharp(svgBuffer).png().toBuffer();

  //   const captchaBase64 = pngBuffer.toString('base64');
  //   const captchaSolver = await solver.imageCaptcha({
  //     body: captchaBase64,
  //   })

  //   return captchaSolver
  // }
}

module.exports = new UserService()