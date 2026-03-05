import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.resolve(process.cwd(), 'data')
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json')

const ensureTasksFile = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(TASKS_FILE)
  } catch {
    await fs.writeFile(TASKS_FILE, '[]\n', 'utf8')
  }
}

const readTasks = async () => {
  await ensureTasksFile()
  const raw = await fs.readFile(TASKS_FILE, 'utf8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? parsed : []
}

const writeTasks = async (tasks) => {
  await ensureTasksFile()
  const safeTasks = Array.isArray(tasks) ? tasks : []
  await fs.writeFile(TASKS_FILE, `${JSON.stringify(safeTasks, null, 2)}\n`, 'utf8')
}

const tasksApiPlugin = () => ({
  name: 'tasks-api',
  configureServer(server) {
    server.middlewares.use('/api/tasks', async (req, res) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')

      try {
        if (req.method === 'GET') {
          const tasks = await readTasks()
          res.statusCode = 200
          res.end(JSON.stringify(tasks))
          return
        }

        if (req.method === 'PUT') {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const rawBody = Buffer.concat(chunks).toString('utf8')
          const body = rawBody ? JSON.parse(rawBody) : []
          await writeTasks(body)
          res.statusCode = 200
          res.end(JSON.stringify({ ok: true }))
          return
        }

        if (req.method === 'DELETE') {
          await writeTasks([])
          res.statusCode = 200
          res.end(JSON.stringify({ ok: true }))
          return
        }

        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Method not allowed' }))
      } catch (error) {
        res.statusCode = 500
        res.end(JSON.stringify({
          error: 'Failed to handle tasks',
          details: error instanceof Error ? error.message : String(error)
        }))
      }
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tasksApiPlugin()],
  server: {
    port: 5173,
    open: true
  }
})
