const { Router } = require("express");
const { tokenExchange } = require("../controllers/tokenExchange");
const router = Router();

router.route("/").post(tokenExchange);

module.exports = router;
