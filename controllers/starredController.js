const pool = require("../config/db");

// Star Repository
const starRepository = async (req, res) => {
    const userId = req.user.id;
    const { repo_id } = req.params;

    try {
        const query = "INSERT IGNORE INTO starred_repos (user_id, repo_id) VALUES (?, ?)";
        await pool.query(query, [userId, repo_id]);

        res.status(201).json({ message: "Repository starred successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Unstar Repository
const deleteRepository = async (req, res) => {
    const userId = req.user.id;
    const { repo_id } = req.params;

    try {
        const query = "DELETE FROM starred_repos WHERE user_id = ? AND repo_id = ?";
        await pool.query(query, [userId, repo_id]);

        res.json({ message: "Repository unstarred successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List Starred Repositories
const listStarRepository = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
      SELECT repositories.* 
      FROM starred_repos 
      INNER JOIN repositories ON starred_repos.repo_id = repositories.id 
      WHERE starred_repos.user_id = ?
    `;
        const [repos] = await pool.query(query, [userId]);

        res.json(repos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    starRepository,
    deleteRepository,
    listStarRepository
}