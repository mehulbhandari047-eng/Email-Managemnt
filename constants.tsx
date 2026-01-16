
import { BackendFile } from './types';

export const BACKEND_FILES: BackendFile[] = [
  {
    path: 'schema.sql',
    language: 'sql',
    description: 'MySQL database structure for users, roles, and tokens.',
    content: `CREATE DATABASE IF NOT EXISTS user_management_db;
USE user_management_db;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('admin'), ('user');

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);`
  },
  {
    path: 'server.js',
    language: 'javascript',
    description: 'Main Express application entry point.',
    content: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`
  },
  {
    path: 'config/db.js',
    language: 'javascript',
    description: 'MySQL connection using mysql2/promise.',
    content: `const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;`
  },
  {
    path: 'middlewares/auth.js',
    language: 'javascript',
    description: 'JWT Authentication and Role-based Access middleware.',
    content: `const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};`
  },
  {
    path: 'controllers/userController.js',
    language: 'javascript',
    description: 'Business logic for user management and authentication.',
    content: `const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const mailer = require('../utils/mailer');
const crypto = require('crypto');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute(
            'SELECT u.*, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE email = ?',
            [email]
        );
        const user = users[0];

        if (!user || !user.is_active || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, is_active, created_at FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.softDelete = async (req, res) => {
    try {
        await db.execute('UPDATE users SET is_active = FALSE WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deactivated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};`
  },
  {
    path: 'utils/mailer.js',
    language: 'javascript',
    description: 'Email utility using Nodemailer.',
    content: `const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

exports.sendResetEmail = async (email, token) => {
    const resetUrl = \`http://localhost:3000/reset-password/\${token}\`;
    await transporter.sendMail({
        from: '"System Admin" <admin@example.com>',
        to: email,
        subject: "Password Reset Request",
        html: \`<p>You requested a password reset. Click <a href="\${resetUrl}">here</a> to reset your password.</p>\`
    });
};`
  }
];
