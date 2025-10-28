import { PortfolioData } from "@/types/portfolio";

const STORAGE_KEY = "portfolio_data";
const AUTH_KEY = "portfolio_auth";

export const defaultPortfolioData: PortfolioData = {
  hero: {
    title: "Building bridges between design and code",
    subtitle: "I'm a design engineer, where I craft intuitive user experiences. After hours, I build my own projects.",
    description: "About · Selene Yu",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
  },
  about: {
    title: "Introduction",
    description: "I'm a passionate developer with years of experience creating web applications that users love. I specialize in modern web technologies and believe in building products that are both beautiful and functional.",
    image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=80",
    experiences: [
      {
        id: "1",
        role: "Senior Frontend Engineer",
        company: "Acme Inc.",
        period: "2021 — Present",
        description: "Leading the frontend team, building design systems and high-performance web apps.",
        order: 0,
      },
      {
        id: "2",
        role: "Frontend Engineer",
        company: "Startup Co.",
        period: "2019 — 2021",
        description: "Developed core product features and collaborated closely with design.",
        order: 1,
      },
    ],
    studies: [
      {
        id: "1",
        degree: "B.Sc. Computer Science",
        institution: "Tech University",
        period: "2015 — 2019",
        description: "Focused on Human-Computer Interaction and web technologies.",
        order: 0,
      },
    ],
  },
  skills: [
    {
      id: "1",
      name: "React & TypeScript",
      icon: "⚛️",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80",
      description: "Building modern, type-safe web applications",
      order: 0,
    },
    {
      id: "2",
      name: "UI/UX Design",
      icon: "🎨",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=80",
      description: "Creating beautiful and intuitive user interfaces",
      order: 1,
    },
    {
      id: "3",
      name: "Full Stack Development",
      icon: "🚀",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80",
      description: "End-to-end application development",
      order: 2,
    },
  ],
  projects: [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A modern e-commerce solution with real-time inventory management",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      tags: ["React", "Node.js", "MongoDB"],
      order: 0,
    },
    {
      id: "2",
      title: "Task Management App",
      description: "Collaborative task manager with team features",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      tags: ["TypeScript", "PostgreSQL", "Docker"],
      order: 1,
    },
  ],
  blog: [
    {
      id: "1",
      title: "Getting Started with React",
      excerpt: "Learn the fundamentals of React and start building modern web applications",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      date: new Date().toISOString().split('T')[0],
      order: 0,
    },
  ],
  gallery: [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
      caption: "Project showcase",
      order: 0,
    },
  ],
  contact: {
    email: "hello@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
};

export const loadPortfolioData = (): PortfolioData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
  }
  return defaultPortfolioData;
};

export const savePortfolioData = (data: PortfolioData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save portfolio data:", error);
  }
};

export const login = (username: string, password: string): boolean => {
  // Simple auth - in production, use proper authentication
  if (username === "admin" && password === "admin123") {
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
