import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "portfolio";
const COLLECTION = process.env.MONGODB_COLLECTION || "portfolio";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment variables.");
}

let client;
let db;

async function initMongo() {
  if (!client) {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected to MongoDB database: ${DB_NAME}`);
  }
  return db;
}

// Basic validation function
const validatePortfolioData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format');
  }

  // Check required top-level sections
  const requiredSections = ['hero', 'about', 'skills', 'projects', 'blog', 'gallery', 'contact'];
  for (const section of requiredSections) {
    if (!(section in data)) {
      throw new Error(`Missing required section: ${section}`);
    }
  }

  // Validate hero section
  if (!data.hero.title || !data.hero.subtitle || !data.hero.description) {
    throw new Error('Hero section missing required fields');
  }

  // Validate contact section
  if (!data.contact.email || !data.contact.location) {
    throw new Error('Contact section missing required fields');
  }

  return true;
};

// GET portfolio
app.get("/api/portfolio", async (req, res) => {
  try {
    const database = await initMongo();
    const col = database.collection(COLLECTION);
    // Use single-document storage (replace with user-scoped storage if needed)
    const doc = await col.findOne({ _id: "portfolio" });
    if (!doc) {
      return res.status(200).json({});
    }
    return res.status(200).json(doc.data || {});
  } catch (err) {
    console.error("GET /api/portfolio error", err);
    return res.status(500).json({ error: "Failed to load portfolio" });
  }
});

// PUT portfolio (upsert)
app.put("/api/portfolio", async (req, res) => {
  try {
    const portfolioData = req.body;

    // Validate the incoming data
    validatePortfolioData(portfolioData);

    const database = await initMongo();
    const col = database.collection(COLLECTION);
    await col.updateOne(
      { _id: "portfolio" },
      { $set: { data: portfolioData, updatedAt: new Date() } },
      { upsert: true }
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("PUT /api/portfolio error", err);
    return res.status(400).json({ error: err.message || "Failed to save portfolio" });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    await initMongo();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});