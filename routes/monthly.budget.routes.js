const { Router } = require("express");
const { calcMonthlyBudget } = require("../controllers/calc.budget");

const router = Router();

router.route("/:userId").get(calcMonthlyBudget);

module.exports = router;
