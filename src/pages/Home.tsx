import { useEffect, useState } from "react";
import { loadPortfolioData, savePortfolioData, defaultPortfolioData } from "@/lib/storage";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import img from "../wallpapers/WhatsApp Image 2025-12-30 at 1.14.30 PMWhatsApp.jpeg"

interface HomeProps {
  isEditable?: boolean;
}

export const Home = ({ isEditable = false }: HomeProps) => {
  const [data, setData] = useState(defaultPortfolioData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loaded = await loadPortfolioData();
        setData(loaded);
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
        // Keep default data if loading fails
      }
    };
    fetchData();
  }, []);

  const handleHeroChange = (field: string, value: string) => {
    const updated = {
      ...data,
      hero: { ...data.hero, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleAboutChange = (field: string, value: string) => {
    const updated = {
      ...data,
      about: { ...data.about, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleSkillsChange = (skills: any[]) => {
    const updated = { ...data, skills };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleProjectsChange = (projects: any[]) => {
    const updated = { ...data, projects };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleContactChange = (field: string, value: any) => {
    const updated = {
      ...data,
      contact: { ...data.contact, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const sortedSkills = [...data.skills].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="">
          <Hero data={data.hero} onChange={handleHeroChange} isEditable={isEditable} />
        </div>
        <About data={data.about} onChange={handleAboutChange} isEditable={isEditable} />

        {/* Skills Preview Section */}
        <section id="skills-preview" className="section-container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold">Skills & Expertise</h2>
            <Link to="/about">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <Skills skills={sortedSkills.slice(0, 3)} onChange={handleSkillsChange} isEditable={isEditable} title="" />
        </section>

        {/* Latest from Blog Section */}
        {data.blog.length > 0 && (
          <section id="latest-blog" className="section-container bg-[hsl(var(--section-bg))]">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold">Latest from Blog</h2>
              <Link to="/blog">
                <Button variant="outline" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {data.blog.slice(0, 3).map((post) => (
                <div key={post.id} className="card-elevated bg-card overflow-hidden group hover-lift">
                  {post.image && (
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-slate-800 from-accent to-primary flex items-center justify-center">
                        <img src={img} className="h-8 w-8 rounded-full bg-background flex items-center justify-center" />

                      </div>
                      <div>
                        <p className="text-sm font-medium">Ebrahim Hashish</p>
                        <p className="text-xs text-muted-foreground">{post.date}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link to="/blog" className="inline-flex items-center mt-4 text-accent hover:text-accent/80 transition-colors">
                      <span className="text-sm font-medium">Read More</span>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Preview Section */}
        {data.gallery.length > 0 && (
          <section id="gallery-preview" className="section-container">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold">Gallery</h2>
              <Link to="/gallery">
                <Button variant="outline" className="group">
                  View All
                  <Eye className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {data.gallery.slice(0, 4).map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg hover-lift">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium truncate">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects Section */}
        {data.projects.length > 0 && (
          <section id="featured-projects" className="section-container bg-[hsl(var(--section-bg))]">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold">Featured Projects</h2>
              <Link to="/work">
                <Button variant="outline" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {data.projects.slice(0, 4).map((project) => (
                <div key={project.id} className="card-elevated bg-card overflow-hidden group hover-lift">
                  <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:text-accent/80 p-0 h-auto font-medium"
                      onClick={() => {
                        if (project.link) {
                          window.open(project.link, '_blank');
                        } else {
                          window.location.href = `/work/${project.id}`;
                        }
                      }}
                    >
                      <span className="text-sm">View Project</span>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <Contact data={data.contact} onChange={handleContactChange} isEditable={isEditable} />

        <footer className="bg-card text-foreground py-12 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg">&copy; 2025 ebrahim kordy Portfolio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
