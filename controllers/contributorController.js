const pool = require('../config/db');

// Add Contributor
const addContributor = async (req, res) => {
  const { repo_id } = req.params;
  const { user_id } = req.body;
  const ownerId = req.user.id;

  try {
    // Verify repository ownership
    const [repo] = await pool.query('SELECT * FROM repositories WHERE id = ? AND user_id = ?', [repo_id, ownerId]);
    if (repo.length === 0) return res.status(403).json({ message: 'Unauthorized access' });

    const query = 'INSERT IGNORE INTO contributors (repo_id, user_id) VALUES (?, ?)';
    await pool.query(query, [repo_id, user_id]);

    res.status(201).json({ message: 'Contributor added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List Contributors
const listContributor = async (req, res) => {
  const { repo_id } = req.params;

  try {
    const query = `
      SELECT users.id, users.username 
      FROM contributors 
      INNER JOIN users ON contributors.user_id = users.id 
      WHERE contributors.repo_id = ?
    `;
    const [contributors] = await pool.query(query, [repo_id]);

    res.json(contributors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    addContributor,
    listContributor
};