const Risk = require('../models/risk');
const Parser = require('rss-parser');
const parser = new Parser();
const logger = require('../logger');
const { notify } = require('./notificationController');

exports.getRisks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const risks = await Risk.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Risk.countDocuments();
  logger.info('Fetched internal risks');
  res.json({
    risks,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
};

exports.addRisk = async (req, res) => {
  const { title, description, source } = req.body;
  const newRisk = new Risk({ title, description, source });

  await newRisk.save();
  logger.info(`Added new internal risk: ${title}`);
  notify(req, `New risk added: ${title}`);
  res.status(201).send('Risk added');
};

exports.fetchExternalRisks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const feed = await parser.parseURL('https://example.com/rss');
  const items = feed.items.slice((page - 1) * limit, page * limit);
  logger.info('Fetched external risks from RSS feed');
  res.json({
    items,
    totalPages: Math.ceil(feed.items.length / limit),
    currentPage: page
  });
};