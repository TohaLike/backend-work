const Router = require("express").Router;
const { body } = require("express-validator");
const userController = require("../controllers/user-controller");


const router = new Router()


router.post(
  "/registration",
  body("name").isLength({ min: 2, max: 55 }),
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
)



router.get("/rehresh")


module.exports = router