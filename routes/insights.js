const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get Repository Insights
router.get('/:repo_id/insights', async (req, res) => {
  const { repo_id } = req.params;

  try {
    const queries = {
      stars: 'SELECT COUNT(*) AS stars FROM starred_repos WHERE repo_id = ?',
      forks: 'SELECT COUNT(*) AS forks FROM repositories WHERE forked_from = ?',
      contributors: 'SELECT COUNT(*) AS contributors FROM contributors WHERE repo_id = ?',
      commits: 'SELECT COUNT(*) AS commits FROM commits WHERE repo_id = ?',
    };

    const [stars] = await pool.query(queries.stars, [repo_id]);
    const [forks] = await pool.query(queries.forks, [repo_id]);
    const [contributors] = await pool.query(queries.contributors, [repo_id]);
    const [commits] = await pool.query(queries.commits, [repo_id]);

    res.json({
      stars: stars[0].stars,
      forks: forks[0].forks,
      contributors: contributors[0].contributors,
      commits: commits[0].commits,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
