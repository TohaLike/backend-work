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

router.get("/refresh", userController.refresh)


module.exports = router