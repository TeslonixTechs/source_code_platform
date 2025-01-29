const pool = require("../config/db");

// Fetch Activity Logs
const fetchActivityLogs = async (req, res) => {
    const { repo_id } = req.params;

    try {
        const query = `
      SELECT id, action, user_id, created_at 
      FROM activity_logs 
      WHERE repo_id = ? 
      ORDER BY created_at DESC
    `;
        const [logs] = await pool.query(query, [repo_id]);

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a Log Entry (Middleware Example)
const addLogEntry = async (req, res) => {
    const { repo_id, user_id, action } = req.body;
    try {
        const query = "INSERT INTO activity_logs (repo_id, user_id, action) VALUES (?, ?, ?)";
        await pool.query(query, [repo_id, user_id, action]);
    } catch (err) {
        console.error("Failed to log activity:", err.message);
    }
};

module.exports = {
    fetchActivityLogs,
    addLogEntry
};