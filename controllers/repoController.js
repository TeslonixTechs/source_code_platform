const pool = require("../config/db");

// Create Repository
const createRepository = async (req, res) => {
    const { name, description, private } = req.body;
    const userId = req.user.id;

    try {
        const query = "INSERT INTO repositories (name, description, private, user_id) VALUES (?, ?, ?, ?)";
        await pool.query(query, [name, description, private, userId]);
        res.status(201).json({ message: "Repository created successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User Repositories
const getUserRepository = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = "SELECT * FROM repositories WHERE user_id = ?";
        const [rows] = await pool.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createRepository,
    getUserRepository
};
