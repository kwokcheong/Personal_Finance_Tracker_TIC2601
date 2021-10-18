const express = require('express');
const db = require('../db');
const router = express.Router();

// form page for income
router.get('/', (req, res) => {
    res.render('./', {
        title: 'This is the create income page',
    });
});


module.exports = router;