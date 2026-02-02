/**
 * Vercel serverless entry: all /api/* requests go to the Express app.
 * Run locally: use backend (cd backend && npm run dev). This file is for Vercel only.
 */
import '../backend/config/dotenv-vercel.js'
import { connectDB } from '../backend/config/db.js'
import app from '../backend/app.js'

let appReady = null

async function getApp() {
  if (appReady) return appReady
  await connectDB()
  appReady = app
  return app
}

export default async function handler(req, res) {
  const expressApp = await getApp()
  return expressApp(req, res)
}
