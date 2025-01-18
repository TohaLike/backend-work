const Router = require("express").Router;
const { body } = require("express-validator");
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = new Router()

router.post(
  "/registration",
  body("name").isLength({ min: 1, max: 55 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  userController.registration
)

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  userController.login
)

router.get("/captcha", userController.captcha)
router.get("/refresh", userController.refresh)

router.get("/verify-captcha", (req, res) => {
  console.log(req.session.captcha);
  res.status(200).send(req.session.captcha);
});

module.exports = router