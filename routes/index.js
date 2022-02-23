const router = require('express').Router();


router.use('/users', require('./users'));
router.use('/bets', require('./bets'));

module.exports = router;