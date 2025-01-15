const bcrypt = require("bcrypt")
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const { models: { User } } = require("../models")
const ApiError = require("../exceptions/api-error")


class UserService {
  async registration(name, password, email) {
    const candidate = await User.findOne({ where: { email } })

    if (candidate) throw ApiError.BadRequest(`Пользователь с таким email адресом '${email}' уже есть`)

    const hashPassword = await bcrypt.hash(password, 3)

    const user = await User.create({ name, password: hashPassword, email })

    const userDto = new UserDto(user.dataValues)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }



}

module.exports = new UserService()