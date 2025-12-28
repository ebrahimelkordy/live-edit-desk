import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationFrameId: number;
    const particles: {x: number, y: number, size: number, speedX: number, speedY: number}[] = [];
    const maxParticles = 30;

    // Initialize particles
    const initParticles = () => {
      particles.length = 0; // Clear existing particles
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * (document.documentElement.classList.contains("dark") ? 0.2 : 0.15), // Slightly slower in light mode
          speedY: (Math.random() - 0.5) * (document.documentElement.classList.contains("dark") ? 0.2 : 0.15)
        });
      }
    };

    // Create animated metallic background with proper light/dark modes
    const drawMetallicBackground = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Define metallic colors for both dark and light modes 
      const isDark = document.documentElement.classList.contains("dark");
      const color1 = isDark ? '220, 30%, 8%' : '200, 25%, 95%'; // Dark vs light base
      const color2 = isDark ? '225, 35%, 6%' : '200, 30%, 92%';
      const accentColor = isDark ? '200, 60%, 40%' : '200, 60%, 60%'; // Adjust accent for both themes

      // Create subtle radial gradient
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 1.5
      );

      gradient.addColorStop(0, `hsla(${color1}, 0.9)`);
      gradient.addColorStop(0.7, `hsla(${color2}, 0.95)`);
      gradient.addColorStop(1, `hsla(${color1}, 1)`);

      // Draw gradient background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw animated particles for subtle metallic shimmer
      ctx.globalAlpha = isDark ? 0.2 : 0.1; // Less opacity in light mode
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Draw particle
        ctx.beginPath();
        const particleGradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 3
        );
        particleGradient.addColorStop(0, `hsla(${accentColor}, 0.8)`);
        particleGradient.addColorStop(1, `hsla(${accentColor}, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      
      // Draw the metallic background with animated particles
      drawMetallicBackground();
      
      // Continue animation
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    initParticles();
    animate();

    // Listen for theme changes to update the background
    const observer = new MutationObserver(() => {
      initParticles(); // Reinitialize particles when theme changes
      drawMetallicBackground();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
