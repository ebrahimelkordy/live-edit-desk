import { EditableText } from "./EditableText";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

interface ContactProps {
  data: {
    email: string;
    phone: string;
    location: string;
    social?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  onChange: (field: string, value: any) => void;
  isEditable?: boolean;
}

export const Contact = ({ data, onChange, isEditable = false }: ContactProps) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      await emailjs.send(
        'service_o76diny',
        'template_j3y20fg',
        templateParams,
        'ai-ngqzgQwSDwI12b'
      );

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="section-container bg-[hsl(var(--section-bg))]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4">Get in Touch</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a question or want to work together? Feel free to reach out!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card-elevated p-6 hover-lift">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <EditableText
                    value={data.email}
                    onChange={(value) => onChange("email", value)}
                    isEditable={isEditable}
                    className="font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="card-elevated p-6 hover-lift">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <EditableText
                    value={data.phone}
                    onChange={(value) => onChange("phone", value)}
                    isEditable={isEditable}
                    className="font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="card-elevated p-6 hover-lift">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <EditableText
                    value={data.location}
                    onChange={(value) => onChange("location", value)}
                    isEditable={isEditable}
                    className="font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {data.social?.github && (
                <a
                  href={data.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card hover:bg-accent hover:text-white transition-all duration-300 card-elevated hover-lift"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {data.social?.linkedin && (
                <a
                  href={data.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card hover:bg-accent hover:text-white transition-all duration-300 card-elevated hover-lift"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {data.social?.twitter && (
                <a
                  href={data.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card hover:bg-accent hover:text-white transition-all duration-300 card-elevated hover-lift"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
                className="hover:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
                className="hover:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project..."
                rows={5}
                required
                className="hover:border-accent transition-colors resize-none"
              />
            </div>
            <Button type="submit" className="w-full hover-lift group" disabled={isSending}>
              <Send className={`mr-2 h-4 w-4 transition-transform ${isSending ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
