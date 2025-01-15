const jwt = require("jsonwebtoken")
const { models: { Token } } = require("../models")

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { userId: userId } })
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save()
    }

    const token = await Token.create({ userId: userId, refreshToken: refreshToken })
    return token
  }

}

module.exports = new TokenService()