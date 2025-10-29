import { PortfolioData } from "@/types/portfolio";

const STORAGE_KEY = "portfolio_data";
const AUTH_KEY = "portfolio_auth";

export const defaultPortfolioData: PortfolioData = {
  hero: {
    title: "",
    subtitle: "",
    description: "",
    image: "",
  },
  about: {
    title: "",
    description: "",
    image: "",
    experiences: [],
    studies: [],
  },
  skills: [],
  projects: [
    {
      id: "1",
      title: "New Project",
      description: "Project description here",
      detailedDescription: "Detailed description of the project with more information about the technologies used, challenges faced, and solutions implemented.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
      ],
      date: "2024-01-15",
      tags: ["Tag1", "Tag2"],
      order: 0,
    },
  ],
  blog: [],
  gallery: [],
  contact: {
    email: "",
    phone: "",
    location: "",
    social: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  },
};

export const loadPortfolioData = async (): Promise<PortfolioData> => {
  try {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        return data as PortfolioData;
      }
    }
    throw new Error("Failed to load data from MongoDB");
  } catch (e) {
    console.error("Failed to load portfolio data from MongoDB:", e);
    // Return default data if MongoDB is unavailable
    return defaultPortfolioData;
  }
};

export const savePortfolioData = async (data: PortfolioData): Promise<void> => {
  try {
    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Failed to save to MongoDB: ${res.statusText}`);
    }
  } catch (e) {
    console.error("Failed to save portfolio data to MongoDB:", e);
    throw e; // Re-throw to let caller handle the error
  }
};

export const login = (username: string, password: string): boolean => {
  // Get credentials from environment variables
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || "admin";
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

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
