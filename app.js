const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const repoRoutes = require('./routes/repos');
const fileRoutes = require('./routes/files');
const issueRoutes = require('./routes/issues');
const profileRoutes = require('./routes/profile');
const starredRoutes = require('./routes/starred');
const forkRoutes = require('./routes/forks');
const contributorRoutes = require('./routes/contributors');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/starred', starredRoutes);
app.use('/api/forks', forkRoutes);
app.use('/api/contributors', contributorRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
