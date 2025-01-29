const pool = require("../config/db");
const axios = require("axios");

// Register Webhook
const registerWebhook = async (req, res) => {
    const { repo_id } = req.params;
    const { url, event } = req.body;
    const userId = req.user.id;

    try {
        // Verify repository ownership
        const [repo] = await pool.query("SELECT * FROM repositories WHERE id = ? AND user_id = ?", [repo_id, userId]);
        if (repo.length === 0) return res.status(403).json({ message: "Unauthorized access" });

        const query = "INSERT INTO webhooks (repo_id, url, event) VALUES (?, ?, ?)";
        await pool.query(query, [repo_id, url, event]);

        res.status(201).json({ message: "Webhook registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Trigger Webhook (Utility Function)
async function triggerWebhook(repo_id, event, payload) {
    try {
        const [webhooks] = await pool.query("SELECT url FROM webhooks WHERE repo_id = ? AND event = ?", [repo_id, event]);
        for (const webhook of webhooks) {
            await axios.post(webhook.url, payload);
        }
    } catch (err) {
        console.error("Webhook trigger failed:", err.message);
    }
}

module.exports = {
    registerWebhook,
};
