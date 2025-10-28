export interface Skill {
  id: string;
  name: string;
  icon: string;
  image?: string;
  description: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  tags: string[];
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  link?: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  image?: string;
  order: number;
}

export interface Study {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  image?: string;
  order: number;
}

export interface PortfolioData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    image?: string;
  };
  about: {
    title: string;
    description: string;
    image?: string;
    experiences: Experience[];
    studies: Study[];
  };
  skills: Skill[];
  projects: Project[];
  blog: BlogPost[];
  gallery: GalleryItem[];
  contact: {
    email: string;
    phone: string;
    location: string;
    social?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}
