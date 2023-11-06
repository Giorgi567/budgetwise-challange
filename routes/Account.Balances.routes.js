const { Router } = require("express");
const { getAccountBalances } = require("../controllers/getAccoutnBalances");

const router = Router();

router.route("/:userId").get(getAccountBalances);

module.exports = router;
