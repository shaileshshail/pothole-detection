const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { createContractor,
    getContractorById,
    getAllContractor,
    getAllContractorIdName,
    deleteContractorById,
    updateContractor,
 } = require('../controllers/contractController');

const validateToken = require('../middleware/validateAccessToken')
const router = express.Router();
//router.use(validateToken);

router.post('/',createContractor);
router.get('/',getAllContractor);
router.get('/short',getAllContractorIdName);
router.get('/:id',getContractorById);
router.put('/',updateContractor);
router.delete('/:id',deleteContractorById);

module.exports = router;