const { Router } = require("express");
const { getUsersTransactions } = require("../controllers/getTransactions");

const router = Router();

router.route("/:userId").get(getUsersTransactions);

module.exports = router;
