const { Router } = require("express");
const { createLinkToken } = require("../controllers/linkToken");

const router = Router();

router.route("/").get(createLinkToken);

module.exports = router;
