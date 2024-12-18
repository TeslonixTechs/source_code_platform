CREATE DATABASE github_clone;

USE github_clone;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  verified BOOLEAN DEFAULT 0
);

CREATE TABLE repositories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  private BOOLEAN DEFAULT FALSE,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  path TEXT NOT NULL,
  size INT NOT NULL,
  repo_id INT NOT NULL,
  FOREIGN KEY (repo_id) REFERENCES repositories(id)
);

CREATE TABLE issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  repo_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open', 'closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repo_id) REFERENCES repositories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE issue_labels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  issue_id INT NOT NULL,
  label VARCHAR(255) NOT NULL,
  FOREIGN KEY (issue_id) REFERENCES issues(id)
);


ALTER TABLE users ADD COLUMN profile_picture TEXT;

CREATE TABLE starred_repos (
  user_id INT NOT NULL,
  repo_id INT NOT NULL,
  PRIMARY KEY (user_id, repo_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (repo_id) REFERENCES repositories(id)
);

ALTER TABLE repositories ADD COLUMN forked_from INT NULL;

CREATE TABLE contributors (
  repo_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (repo_id, user_id),
  FOREIGN KEY (repo_id) REFERENCES repositories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE repositories ADD COLUMN readme_path TEXT;

CREATE TABLE pull_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  repo_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  source_branch VARCHAR(255),
  target_branch VARCHAR(255),
  status ENUM('open', 'closed', 'merged') DEFAULT 'open',
  FOREIGN KEY (repo_id) REFERENCES repositories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  repo_id INT NOT NULL,
  user_id INT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repo_id) REFERENCES repositories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE webhooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  repo_id INT NOT NULL,
  url TEXT NOT NULL,
  event ENUM('commit', 'pull_request', 'issue') NOT NULL,
  FOREIGN KEY (repo_id) REFERENCES repositories(id)
);

CREATE TABLE commits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  repo_id INT NOT NULL,
  message TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repo_id) REFERENCES repositories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cicd (
  id INT AUTO_INCREMENT PRIMARY KEY,
  repo_id INT NOT NULL,
  build_command TEXT,
  deploy_command TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repo_id) REFERENCES repositories(id)
);
