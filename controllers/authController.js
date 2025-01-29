const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const transporter = require("../config/nodemailer");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

require("dotenv").config();

// Register
const userRegistration = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const query = "INSERT INTO users (username, email, password, verified) VALUES (?, ?, ?, ?)";
        await pool.query(query, [username, email, hashedPassword, 0]);

        const verificationLink = `http://localhost:3000/api/auth/verify?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Email Verification",
            text: `Click the link to verify your email: ${verificationLink}`,
        });

        res.status(201).json({ message: "Registration successful. Verify your email." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Verify Email
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const query = "UPDATE users SET verified = 1 WHERE email = ?";
        await pool.query(query, [decoded.email]);
        res.status(200).json({ message: "Email verified successfully." });
    } catch (err) {
        res.status(400).json({ error: "Invalid or expired token." });
    }
};

// Login
const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = "SELECT * FROM users WHERE email = ?";
        const [rows] = await pool.query(query, [email]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = rows[0];
        if (!user.verified) return res.status(401).json({ message: "Email not verified" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, message: "Login successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Enable 2FA
const twoFactorSetup = async (req, res) => {
    const userId = req.user.id;

    // Generate a 2FA secret
    const secret = speakeasy.generateSecret({ name: `GitHubClone (${req.user.email})` });

    // Save the secret in the database
    await pool.query("UPDATE users SET two_factor_secret = ? WHERE id = ?", [secret.base32, userId]);

    // Generate a QR code for the authenticator app
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({ qrCodeUrl, manualEntryKey: secret.base32 });
};

// Verify 2FA Code
const verifyTwoFactor = async (req, res) => {
    const { token } = req.body;
    const userId = req.user.id;

    const [user] = await pool.query("SELECT two_factor_secret FROM users WHERE id = ?", [userId]);
    if (!user[0].two_factor_secret) return res.status(400).json({ message: "2FA is not enabled" });

    const verified = speakeasy.totp.verify({
        secret: user[0].two_factor_secret,
        encoding: "base32",
        token,
    });

    if (verified) {
        res.json({ message: "2FA verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid 2FA code" });
    }
};

module.exports = {
    userLogin,
    userRegistration,
    verifyEmail,
    verifyTwoFactor,
    twoFactorSetup,
};
