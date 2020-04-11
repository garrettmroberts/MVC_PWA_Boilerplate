const express = require('express');
const router = express.Router();

module.exports = function(router) {
  router.get('/', (req, res) => res.render('index.hbs'));
};