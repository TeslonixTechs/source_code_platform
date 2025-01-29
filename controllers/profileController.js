const pool = require("../config/db");

// Get Profile
const getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = "SELECT id, username, email, profile_picture FROM users WHERE id = ?";
        const [users] = await pool.query(query, [userId]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Profile (Username and Profile Picture only)
const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    try {
        const updates = [];
        const values = [];

        if (username) {
            updates.push("username = ?");
            values.push(username);
        }

        if (profilePicture) {
            updates.push("profile_picture = ?");
            values.push(profilePicture);
        }

        if (updates.length === 0) return res.status(400).json({ message: "No fields to update" });

        const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
        values.push(userId);

        await pool.query(query, values);

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};