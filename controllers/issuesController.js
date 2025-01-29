const pool = require("../config/db");

// Create Issue
const createIssue = async (req, res) => {
    const { repo_id } = req.params;
    const { title, description, labels } = req.body;
    const userId = req.user.id;

    try {
        // Verify repository ownership
        const [repo] = await pool.query("SELECT * FROM repositories WHERE id = ? AND user_id = ?", [repo_id, userId]);
        if (repo.length === 0) return res.status(403).json({ message: "Unauthorized access" });

        const query = "INSERT INTO issues (title, description, labels, status, repo_id) VALUES (?, ?, ?, ?, ?)";
        await pool.query(query, [title, description, JSON.stringify(labels), "open", repo_id]);

        res.status(201).json({ message: "Issue created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List Issues
const listIssues = async (req, res) => {
    const { repo_id } = req.params;

    try {
        const query = "SELECT id, title, description, labels, status FROM issues WHERE repo_id = ?";
        const [issues] = await pool.query(query, [repo_id]);
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Issue Status
const updateIssueStatus = async (req, res) => {
    const { repo_id, issue_id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    try {
        // Verify repository ownership
        const [repo] = await pool.query("SELECT * FROM repositories WHERE id = ? AND user_id = ?", [repo_id, userId]);
        if (repo.length === 0) return res.status(403).json({ message: "Unauthorized access" });

        const query = "UPDATE issues SET status = ? WHERE id = ? AND repo_id = ?";
        await pool.query(query, [status, issue_id, repo_id]);

        res.json({ message: "Issue status updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create Issue
const createIssue1 = async (req, res) => {
    const { repo_id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    try {
        const query = "INSERT INTO issues (repo_id, user_id, title, description, status) VALUES (?, ?, ?, ?, ?)";
        await pool.query(query, [repo_id, userId, title, description, "open"]);

        res.status(201).json({ message: "Issue created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List Issues
const listIssues1 = async (req, res) => {
    const { repo_id } = req.params;

    try {
        const query = "SELECT * FROM issues WHERE repo_id = ? ORDER BY created_at DESC";
        const [issues] = await pool.query(query, [repo_id]);

        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add Label to Issue
const addIssueLabel = async (req, res) => {
    const { issue_id } = req.params;
    const { label } = req.body;

    try {
        const query = "INSERT INTO issue_labels (issue_id, label) VALUES (?, ?)";
        await pool.query(query, [issue_id, label]);

        res.status(201).json({ message: "Label added to issue" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createIssue,
    createIssue1,
    listIssues,
    listIssues1,
    addIssueLabel,
    updateIssueStatus
};