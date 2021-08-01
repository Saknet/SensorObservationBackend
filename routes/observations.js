const express = require('express');
const router = express.Router();
const observations = require('../services/observations');

/* GET observations. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await observations.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting observations`, err.message);
    next(err);
  }
});

module.exports = router;