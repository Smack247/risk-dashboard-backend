const express = require('express');
const { getRisks, addRisk, fetchExternalRisks } = require('../controllers/riskController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/external', authMiddleware, roleMiddleware(['executive', 'auditor']), fetchExternalRisks);
router.get('/internal', authMiddleware, roleMiddleware(['auditor']), getRisks);
router.post('/internal', authMiddleware, roleMiddleware(['auditor']), addRisk);

module.exports = router;