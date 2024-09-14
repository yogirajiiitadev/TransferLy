
const express = require('express');
const userRouter = require('./userRouter');
const accountRouter = require('./accountRouter');
const router = express.Router();

router.use("/user",userRouter);
router.use("/accounts",accountRouter);

module.exports = router;