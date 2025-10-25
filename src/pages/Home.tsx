import { useState } from "react";
import { Link } from "react-router-dom";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";

interface HomeProps {
  isEditable?: boolean;
}

export const Home = ({ isEditable = false }: HomeProps) => {
  const [data, setData] = useState(loadPortfolioData());

  const handleHeroChange = (field: string, value: string) => {
    const updated = {
      ...data,
      hero: { ...data.hero, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const featuredProject = data.projects.find((p) => p.order === 0) || data.projects[0];
  const latestBlogPosts = data.blog.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-container pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
              Once UI
            </span>
            <span className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
              Featured work
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <EditableText
              value={data.hero.title}
              onChange={(value) => handleHeroChange("title", value)}
              isEditable={isEditable}
            />
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            <EditableText
              value={data.hero.description}
              onChange={(value) => handleHeroChange("description", value)}
              multiline
              isEditable={isEditable}
            />
          </p>

          <Link
            to="/about"
            className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
            <span className="text-sm font-medium">About – Selene Yu</span>
          </Link>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="section-container py-20">
          <div className="max-w-4xl mx-auto">
            <Link to={`/work#${featuredProject.id}`} className="block group">
              <div className="mb-6 rounded-2xl overflow-hidden card-elevated">
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="w-full h-auto"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                {featuredProject.title}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
                <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
              </div>
              <p className="text-muted-foreground mb-6">
                {featuredProject.description}
              </p>
              <span className="text-accent font-medium group-hover:underline">
                Read case study →
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Latest from Blog */}
      {latestBlogPosts.length > 0 && (
        <section className="section-container py-20 bg-[hsl(var(--section-bg))]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Latest from the blog</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {latestBlogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog#${post.id}`}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Selene Yu</p>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {post.excerpt}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
