const { Router } = require("express");
const { getAccessKey } = require("../controllers/getAccesKey");

const router = Router();

router.route("/:userId").get(getAccessKey);

module.exports = router;
