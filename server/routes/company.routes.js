const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/my', authenticate, authorize('employer'), companyController.getMyCompany);
router.post('/', authenticate, authorize('employer'), companyController.createCompany);
router.put('/my', authenticate, authorize('employer'), companyController.updateCompany);
router.get('/:id', companyController.getCompany);

module.exports = router;
