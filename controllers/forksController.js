const pool = require("../config/db");

// Fork Repository
const forkRepository = async (req, res) => {
    const userId = req.user.id;
    const { repo_id } = req.params;

    try {
        // Get original repository
        const [repos] = await pool.query("SELECT * FROM repositories WHERE id = ?", [repo_id]);
        if (repos.length === 0) return res.status(404).json({ message: "Repository not found" });

        const originalRepo = repos[0];

        // Create forked repository
        const query = "INSERT INTO repositories (name, description, private, user_id, forked_from) VALUES (?, ?, ?, ?, ?)";
        await pool.query(query, [`${originalRepo.name}-fork`, originalRepo.description, originalRepo.private, userId, repo_id]);

        res.status(201).json({ message: "Repository forked successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const forkRepository1 = async (req, res) => {
    const { repo_id } = req.params;
    const userId = req.user.id;

    try {
        // Get original repository details
        const [repo] = await pool.query("SELECT * FROM repositories WHERE id = ?", [repo_id]);
        if (repo.length === 0) return res.status(404).json({ message: "Repository not found" });

        const { name, description, visibility } = repo[0];

        // Create fork
        const query = `
      INSERT INTO repositories (name, description, visibility, forked_from, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;
        await pool.query(query, [name, description, visibility, repo_id, userId]);

        res.status(201).json({ message: "Repository forked successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    forkRepository,
    forkRepository1
};