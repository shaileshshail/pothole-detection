const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { createReport,
     getAllReport,
     deleteReportById,
    getReportByContractorId,
    updateReportByContractor } = require('../controllers/reportController');

const validateToken = require('../middleware/validateAccessToken')
const router = express.Router();
//router.use(validateToken);

router.post('/',upload.array('file',2),createReport);
router.get('/',getAllReport);
router.get('/own',getReportByContractorId);
router.put('/afterimage',upload.single('file'),updateReportByContractor);
router.delete('/:id',deleteReportById);

module.exports = router;