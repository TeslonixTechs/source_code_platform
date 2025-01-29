const express = require('express');
const authenticateToken = require('../middleware/auth');
const upload = require('../config/multer').upload1;
const router = express.Router();
const filesController = require('../controllers/filesController');

// Upload File
router.post('/:repo_id', authenticateToken, upload.single('file'), filesController.uploadFile);

// List Files
router.get('/:repo_id', authenticateToken, filesController.listFiles);

// Download File
router.get('/:repo_id/:file_id/download', authenticateToken, filesController.downloadFile);

router.get('/:repo_id/clone', authenticateToken, filesController.cloneRepository);

module.exports = router;