import express from 'express'
import cors from 'cors'
import { atomsData } from './data/atoms.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/atoms', (req, res) => {
  res.json(Object.values(atomsData))
})

app.get('/api/atoms/:symbol', (req, res) => {
  const symbol = req.params.symbol.toLowerCase()
  const atom = atomsData[symbol]
  
  if (atom) {
    res.json(atom)
  } else {
    res.status(404).json({ error: 'Atom not found' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
