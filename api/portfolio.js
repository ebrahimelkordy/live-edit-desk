import { connectDB } from '../lib/db.js';

// Default portfolio data
const defaultPortfolioData = {
  logo: "kordy4276",
  hero: {
    title: "ebrahim Hashish",
    subtitle: "Full-Stack Web Developer (Frontend Focused)",
    description: "Crafting beautiful, responsive web experiences with modern technologies",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23000000'/%3E%3C/svg%3E",  // Black SVG placeholder
  },
  about: {
    title: "About Me",
    description: "I'm a passionate full-stack web developer with a strong focus on frontend technologies. I specialize in creating responsive, user-friendly interfaces using modern JavaScript frameworks and libraries. With expertise in both frontend and backend development, I build complete web applications that are both visually appealing and functionally robust.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23000000'/%3E%3C/svg%3E",  // Black SVG placeholder
    experiences: [],
    studies: [],
  },
  skills: [
    {
      id: "1",
      name: "JavaScript",
      icon: "",
      description: "Modern JavaScript development",
      order: 0
    },
    {
      id: "2",
      name: "React",
      icon: "",
      description: "Building interactive UIs",
      order: 1
    },
    {
      id: "3",
      name: "Node.js",
      icon: "",
      description: "Server-side JavaScript",
      order: 2
    }
  ],
  projects: [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "A full-featured online shopping experience",
      detailedDescription: "This project involved creating a complete e-commerce solution with product catalog, shopping cart, user authentication, and payment processing.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
        "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80"
      ],
      date: "2024-01-15",
      tags: ["React", "Node.js", "MongoDB"],
      order: 0,
    },
  ],
  blog: [],
  gallery: [],
  contact: {
    email: "ebrahimkordy0@gmail.com",
    phone: "+20 01060899732",
    location: "Egypt, Cairo",
    social: {
      github: "https://github.com/ebrahimelkordy",
      linkedin: "https://www.linkedin.com/in/ebrahim-elkordy-3a104b214/",
      twitter: "https://x.com/ebrahimkordy",
    },
  },
};

export default async function handler(req, res) {
  console.log(`[API] ${req.method} request to /api/portfolio`);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    console.log('[API] OPTIONS request handled');
    res.status(200).end();
    return;
  }

  try {
    console.log('[API] Connecting to database...');
    const db = await connectDB();
    console.log('[API] Database connected successfully');
    const portfolioCollection = db.collection('portfolio');

    if (req.method === 'GET') {
      console.log('[API] GET request - fetching portfolio data');
      // Return portfolio data
      const portfolio = await portfolioCollection.findOne({ id: 'main' });
      console.log('[API] Portfolio data retrieved:', portfolio ? 'Found existing data' : 'Using default data');

      if (portfolio) {
        console.log('[API] Returning existing portfolio data from database');
        res.status(200).json(portfolio);
      } else {
        console.log('[API] No portfolio found in database, returning default data');
        res.status(200).json(defaultPortfolioData);
      }
    } else if (req.method === 'PUT') {
      console.log('[API] PUT request - saving portfolio data');
      // Save portfolio data
      const { body } = req;

      console.log('[API] Received portfolio data to save:', JSON.stringify(body, null, 2));

      // Basic validation
      const requiredSections = ['hero', 'about', 'skills', 'projects', 'blog', 'gallery', 'contact'];
      for (const section of requiredSections) {
        if (!(section in body)) {
          console.log(`[API] Missing required section: ${section}`);
          return res.status(400).json({ error: `Missing required section: ${section}` });
        }
      }

      // Remove _id from the body if present to avoid MongoDB immutability error
      const { _id, ...portfolioData } = body;
      console.log('[API] Updating portfolio in database...');
      await portfolioCollection.updateOne(
        { id: 'main' },
        { $set: { ...portfolioData, updatedAt: new Date(), id: 'main' } },
        { upsert: true }
      );
      console.log('[API] Portfolio data saved successfully to database');

      res.status(200).json({ ok: true, message: 'Portfolio saved successfully' });
    } else {
      console.log(`[API] Method not allowed: ${req.method}`);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[API] Server error:', error);
    // Check if it's a MongoDB connection error
    if (error.message.includes('MONGODB_URI')) {
      console.error('[API] MongoDB URI not configured properly');
      return res.status(500).json({
        error: 'Database configuration error',
        message: 'Please make sure MONGODB_URI is set in environment variables'
      });
    }

    res.status(500).json({
      error: error.message,
      message: 'Internal server error'
    });
  }
}