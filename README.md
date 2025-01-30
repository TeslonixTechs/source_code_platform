# GitHub Clone Backend

This project is a GitHub clone backend built using **Node.js**, **Express**, and **MySQL**. It provides essential features like user authentication, repository management, issues tracking, commits, webhooks, and CI/CD configurations. The system is designed to handle RESTful APIs and incorporates JWT-based authentication and email-based user verification.

---

## Features

### **Authentication**

- User Registration with email verification (using OTP).
- JWT-based login and token management.
- Two-factor authentication (2FA) for enhanced security.

### **User Management**

- View and update user profiles.
- Upload profile pictures.
- Restriction: Email cannot be updated after registration.

### **Repository Management**

- Create, update, and delete repositories.
- Public and private repository options.
- Fork repositories.
- Display README.md files.
- Star repositories.

### **Issues and Labels**

- Create, view, and manage issues for repositories.
- Add labels to issues.

### **Commits**

- Track commit history for repositories.
- Display commit logs.

### **Webhooks**

- Create and manage webhooks to send repository events to external services.

### **CI/CD Integration**

- Basic CI/CD pipeline simulation.
- Automatically run tests and deploy code changes.

### **Notifications**

- Notify users of significant events (e.g., new issues, starred repositories).

### **Search**

- Search for users and repositories.

### **Advanced Features**

- Two-factor authentication (2FA) with QR code and secret keys.
- Activity feed for repository events.

---

## Project Structure

```
github-clone-backend/
├── config/
│   ├── db.js                # Database connection setup
│   ├── email.js             # Email service configuration
│   ├── jwt.js               # JWT token management utilities
├── controllers/
│   ├── authController.js    # User authentication and registration logic
│   ├── repoController.js    # Repository CRUD operations
│   ├── userController.js    # User profile and management
│   ├── issueController.js   # Issue and label management
│   ├── webhookController.js # Webhook handling
│   ├── commitController.js  # Commit history management
│   ├── cicdController.js    # CI/CD configuration logic
│   ├── notificationController.js # Notification system
│   ├── searchController.js  # Search for users and repositories
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── validation.js        # Input validation middleware
├── models/
│   ├── User.js              # User model (database queries)
│   ├── Repository.js        # Repository model (database queries)
│   ├── Issue.js             # Issue and label model
│   ├── Commit.js            # Commit model
│   ├── Webhook.js           # Webhook model
│   ├── CICD.js              # CI/CD model
│   ├── Notification.js      # Notification model
├── routes/
│   ├── auth.js              # Routes for authentication
│   ├── users.js             # Routes for user-related operations
│   ├── repositories.js      # Routes for repository-related operations
│   ├── issues.js            # Routes for issues and labels
│   ├── commits.js           # Routes for commit history
│   ├── cicd.js              # Routes for CI/CD
│   ├── notifications.js     # Routes for notifications
│   ├── search.js            # Routes for search functionality
│   ├── webhooks.js          # Routes for webhooks
├── utils/
│   ├── helpers.js           # Reusable utility functions
│   ├── logger.js            # Logging utilities
├── .env                     # Environment variables
├── .gitignore               # Files to ignore in version control
├── package.json             # Project dependencies and scripts
├── server.js                # Main application entry point
└── README.md                # Project documentation
```

---

## Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/github-clone-backend.git
cd github-clone-backend
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Setup Environment Variables**

Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=github_clone
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

### **4. Setup the Database**

Run the SQL scripts to create the database and tables:

```sql
CREATE DATABASE github_clone;
-- Use the detailed table creation scripts from the feature sections
```

### **5. Start the Server**

```bash
npm start
```

Server will run at `http://localhost:5000`.

---

## API Endpoints

### **Authentication**

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and get a JWT.
- `POST /api/auth/2fa/setup`: Enable 2FA for a user.
- `POST /api/auth/2fa/verify`: Verify a 2FA token.

### **User Management**

- `GET /api/users/:id`: Get user profile.
- `PUT /api/users/:id`: Update user profile (excluding email).

### **Repositories**

- `POST /api/repositories`: Create a repository.
- `GET /api/repositories/:id`: Get repository details.
- `PUT /api/repositories/:id`: Update repository details.
- `DELETE /api/repositories/:id`: Delete a repository.

### **Issues**

- `POST /api/issues/:repo_id`: Create an issue.
- `GET /api/issues/:repo_id`: List all issues for a repository.
- `POST /api/issues/:issue_id/labels`: Add a label to an issue.

### **Webhooks**

- `POST /api/webhooks`: Create a webhook for a repository.
- `DELETE /api/webhooks/:id`: Delete a webhook.

### **Search**

- `GET /api/search?query=...`: Search for repositories and users.

---

## Future Enhancements

### **1. Organizations**

Support organization-level repositories and team collaboration:

#### **Code Snippet**

```javascript
// Organization Model (models/Organization.js)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Organization = sequelize.define('Organization', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Organization;
```

### **2. Private Messaging**

Enable private messaging between users:

#### **Code Snippet**

```javascript
// Messaging Route (routes/messaging.js)
router.post('/send', authMiddleware, async (req, res) => {
  const { recipientId, message } = req.body;
  const senderId = req.user.id;

  try {
    const newMessage = await Message.create({ senderId, recipientId, message });
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});
```

### **3. GraphQL API**

Add GraphQL support for optimized data queries:

#### **Code Snippet**

```javascript
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    user(id: ID!): User
    repository(id: ID!): Repository
  }

  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Repository {
    id: ID!
    name: String!
    owner: User!
  }
`;

const resolvers = {
  Query: {
    user: async (_, { id }) => await User.findByPk(id),
    repository: async (_, { id }) => await Repository.findByPk(id)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
```

### **4. Mobile App Support**

Develop a companion mobile app with features like push notifications using Firebase.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contributors

- **Your Name** - [GitHub Profile](https://github.com/yourusername)

Feel free to open issues or submit pull requests for improvements!
