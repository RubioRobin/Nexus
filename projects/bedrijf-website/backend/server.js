import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8787;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const QUEUE_PATH = path.join(DATA_DIR, 'build-queue.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(QUEUE_PATH)) fs.writeFileSync(QUEUE_PATH, '[]', 'utf8');
}

function readQueue() {
  ensureStore();
  return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
}

function writeQueue(items) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(items, null, 2), 'utf8');
}

function assignOwner(task) {
  const matrix = {
    'Sheet automatisering': 'codeur-sheet',
    'View / export tooling': 'codeur-export',
    'QA / validatie': 'codeur-qa',
    'Parameterbeheer': 'codeur-parameters'
  };
  return matrix[task?.intake?.addinType] || 'codeur-general';
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'nexus-intake-backend' });
});

app.get('/api/build-queue', (_req, res) => {
  const queue = readQueue();
  res.json({ count: queue.length, items: queue });
});

app.post('/api/intake', (req, res) => {
  const task = req.body;

  if (!task?.taskId || !task?.traceId || !task?.customer?.email || !task?.intake?.problem) {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }

  const queue = readQueue();
  const assignedTo = assignOwner(task);
  const queuedTask = {
    ...task,
    assignedTo,
    queueStatus: 'queued',
    queuedAt: new Date().toISOString()
  };

  queue.push(queuedTask);
  writeQueue(queue);

  return res.json({ ok: true, taskId: queuedTask.taskId, assignedTo, queueStatus: queuedTask.queueStatus });
});

app.post('/api/build-queue/:taskId/start', (req, res) => {
  const { taskId } = req.params;
  const queue = readQueue();
  const idx = queue.findIndex(x => x.taskId === taskId);
  if (idx < 0) return res.status(404).json({ ok: false, error: 'Task not found' });

  queue[idx].queueStatus = 'in_progress';
  queue[idx].startedAt = new Date().toISOString();
  writeQueue(queue);
  return res.json({ ok: true, taskId, queueStatus: 'in_progress' });
});

ensureStore();
app.listen(PORT, () => {
  console.log(`nexus-intake-backend listening on :${PORT}`);
});
