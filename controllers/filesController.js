const path = require('path');
const zip = new require('adm-zip')();
const pool = require('../config/db');

// Upload File
const uploadFile = async (req, res) => {
  const { repo_id } = req.params;
  const userId = req.user.id;
  const file = req.file;

  try {
    // Check if the repository belongs to the user
    const [repo] = await pool.query('SELECT * FROM repositories WHERE id = ? AND user_id = ?', [repo_id, userId]);
    if (repo.length === 0) return res.status(403).json({ message: 'Unauthorized access' });

    const query = 'INSERT INTO files (name, path, size, repo_id) VALUES (?, ?, ?, ?)';
    await pool.query(query, [file.originalname, file.path, file.size, repo_id]);

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List Files
const listFiles = async (req, res) => {
  const { repo_id } = req.params;
  const userId = req.user.id;

  try {
    // Check if the repository belongs to the user
    const [repo] = await pool.query('SELECT * FROM repositories WHERE id = ? AND user_id = ?', [repo_id, userId]);
    if (repo.length === 0) return res.status(403).json({ message: 'Unauthorized access' });

    const query = 'SELECT id, name, size, path FROM files WHERE repo_id = ?';
    const [files] = await pool.query(query, [repo_id]);

    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download File
const downloadFile = async (req, res) => {
  const { repo_id, file_id } = req.params;
  const userId = req.user.id;

  try {
    // Check if the repository belongs to the user
    const [repo] = await pool.query('SELECT * FROM repositories WHERE id = ? AND user_id = ?', [repo_id, userId]);
    if (repo.length === 0) return res.status(403).json({ message: 'Unauthorized access' });

    const query = 'SELECT path FROM files WHERE id = ? AND repo_id = ?';
    const [files] = await pool.query(query, [file_id, repo_id]);
    if (files.length === 0) return res.status(404).json({ message: 'File not found' });

    const filePath = files[0].path;
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cloneRepository = async (req, res) => {
  const { repo_id } = req.params;

  try {
    // Fetch repository files
    const [files] = await pool.query('SELECT path FROM files WHERE repo_id = ?', [repo_id]);
    if (files.length === 0) return res.status(404).json({ message: 'No files in repository' });

    // Add files to zip
    files.forEach(file => zip.addLocalFile(file.path));

    const tempPath = `./uploads/repositories/${repo_id}.zip`;
    zip.writeZip(tempPath);
    res.download(tempPath, `${repo_id}.zip`, () => {
      fs.unlinkSync(tempPath); // Clean up after download
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    uploadFile,
    downloadFile,
    cloneRepository,
    listFiles
};