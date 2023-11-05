const { Router } = require("express");
const { calcMonthlyBudget } = require("../controllers/calc.budget");

const router = Router();

router.route("/:userId").post(calcMonthlyBudget);

module.exports = router;
