import { PortfolioData } from "@/types/portfolio";

const STORAGE_KEY = "portfolio_data";
const AUTH_KEY = "portfolio_auth";

export const defaultPortfolioData: PortfolioData = {
  logo: "kordy4276",
  hero: {
    title: "abo hashish",
    subtitle: "Full-Stack Web Developer (Frontend Focused)",
    description: "Crafting beautiful, responsive web experiences with modern technologies",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23000000'/%3E%3C/svg%3E",  // Black SVG placeholder
  },
  about: {
    title: "About Me",
    description: "I'm a passionate full-stack web developer with a strong focus on frontend technologies. I specialize in creating responsive, user-friendly interfaces using modern JavaScript frameworks and libraries. With expertise in both frontend and backend development, I build complete web applications that are both visually appealing and functionally robust.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23000000'/%3E%3C/svg%3E",  // Black SVG placeholder
    cv: "",
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
 "contact": {
    "email": "ebrahimkordy0@gmail.com",
    "phone": "+20 01060899732",
    "location": "Egypt, Cairo",
    "social": {
      "github": "https://github.com/ebrahimelkordy",
      "linkedin": "https://www.linkedin.com/in/ebrahim-elkordy-3a104b214/",
      "twitter": "https://x.com/ebrahimkordy"
    }
  },
};

export const loadPortfolioData = async (): Promise<PortfolioData> => {
  try {
    // Use relative path for Vercel API routes
    const res = await fetch(`/api/portfolio`);
    if (res.ok) {
      const data = await res.json();
      // If API returns empty object, use default data instead
      if (data && Object.keys(data).length > 0) {
        return data as PortfolioData;
      } else {
        return defaultPortfolioData;
      }
    }
    // If API call fails completely, use default data
    return defaultPortfolioData;
  } catch (e) {
    console.error("Failed to load portfolio data:", e);
    // Return default data if API is unavailable
    return defaultPortfolioData;
  }
};

export const savePortfolioData = async (data: PortfolioData): Promise<void> => {
  try {
    // Use relative path for Vercel API routes
    const res = await fetch(`/api/portfolio`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Failed to save to API: ${res.statusText}`);
    }
  } catch (e) {
    console.error("Failed to save portfolio data:", e);
    throw e; // Re-throw to let caller handle the error
  }
};

export const login = (username: string, password: string): boolean => {
  // Get credentials from environment variables
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || "";
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "";

  if (username === adminUsername && password === adminPassword) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === "true";
};
