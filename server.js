const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.VERCEL ? '/tmp/votes.json' : path.join(__dirname, 'votes.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, JSON.stringify({ suffixes: [] }, null, 2));
  }
}

async function loadVotes() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(content);
}

async function saveVotes(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function normalizeStudentId(id) {
  return String(id || '').trim();
}

function getLastFour(id) {
  return normalizeStudentId(id).replace(/\s+/g, '').slice(-4).toUpperCase();
}

app.post('/vote', async (req, res) => {
  const { name, studentId, position } = req.body;
  const trimmedName = String(name || '').trim();
  const trimmedId = normalizeStudentId(studentId);
  const trimmedPosition = String(position || '').trim();
  const suffix = getLastFour(trimmedId);

  if (!trimmedName || !trimmedId || !trimmedPosition) {
    return res.status(400).json({ message: 'Please enter name, student ID, and position.' });
  }

  const idPattern = /^FT\d{2}CMP/i;
  if (!idPattern.test(trimmedId)) {
    return res.status(400).json({ message: 'Invalid Detail. You are not Eligible' });
  }

  const data = await loadVotes();
  if (data.suffixes.includes(suffix)) {
    return res.status(409).json({ message: 'You have voted.' });
  }

  data.suffixes.push(suffix);
  data.activities = data.activities || [];
  data.activities.push({
    name: trimmedName,
    studentId: trimmedId,
    position: trimmedPosition,
    suffix: suffix,
    timestamp: new Date().toISOString()
  });

  await saveVotes(data);

  res.json({ message: `Thank you, ${trimmedName}. Your vote has been recorded.` });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin/activities', async (req, res) => {
  try {
    const data = await loadVotes();
    const activities = data.activities || [];
    const totalVotes = activities.length;
    const uniqueVoters = data.suffixes ? data.suffixes.length : 0;

    res.json({
      activities: activities.reverse(), // Most recent first
      totalVotes,
      uniqueVoters
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admin/approve', async (req, res) => {
  try {
    const { studentId } = req.body;
    const data = await loadVotes();
    
    const activity = data.activities.find(a => a.studentId === studentId);
    if (!activity) {
      return res.status(404).json({ message: 'Voter not found.' });
    }
    
    activity.approved = true;
    await saveVotes(data);
    
    res.json({ message: 'Voter approved successfully.' });
  } catch (error) {
    console.error('Error approving voter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/admin/delete', async (req, res) => {
  try {
    const { studentId } = req.body;
    const data = await loadVotes();
    
    const activityIndex = data.activities.findIndex(a => a.studentId === studentId);
    if (activityIndex === -1) {
      return res.status(404).json({ message: 'Voter not found.' });
    }
    
    const activity = data.activities[activityIndex];
    data.activities.splice(activityIndex, 1);
    
    // Also remove from suffixes if exists
    const suffixIndex = data.suffixes.indexOf(activity.suffix);
    if (suffixIndex !== -1) {
      data.suffixes.splice(suffixIndex, 1);
    }
    
    await saveVotes(data);
    
    res.json({ message: 'Voter deleted successfully.' });
  } catch (error) {
    console.error('Error deleting voter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Election server listening on http://localhost:${PORT}`);
});

module.exports = app;
