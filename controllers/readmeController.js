const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// Upload or Update README.md
const createReadme = async (req, res) => {
  const { repo_id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    // Verify repository ownership
    const [repo] = await pool.query('SELECT * FROM repositories WHERE id = ? AND user_id = ?', [repo_id, userId]);
    if (repo.length === 0) return res.status(403).json({ message: 'Unauthorized access' });

    // Define README file path
    const readmePath = `./uploads/repositories/${repo_id}/README.md`;

    // Create the repository directory if it doesn't exist
    fs.mkdirSync(path.dirname(readmePath), { recursive: true });

    // Write the content to the README file
    fs.writeFileSync(readmePath, content);

    // Update repository record with the README path
    await pool.query('UPDATE repositories SET readme_path = ? WHERE id = ?', [readmePath, repo_id]);

    res.status(201).json({ message: 'README.md updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get README.md
const getReadme = async (req, res) => {
  const { repo_id } = req.params;

  try {
    // Fetch README path
    const [repo] = await pool.query('SELECT readme_path FROM repositories WHERE id = ?', [repo_id]);
    if (repo.length === 0 || !repo[0].readme_path) return res.status(404).json({ message: 'README.md not found' });

    const readmePath = repo[0].readme_path;

    // Check if file exists and return content
    if (!fs.existsSync(readmePath)) return res.status(404).json({ message: 'README.md not found' });

    const content = fs.readFileSync(readmePath, 'utf8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    createReadme,
    getReadme
}
