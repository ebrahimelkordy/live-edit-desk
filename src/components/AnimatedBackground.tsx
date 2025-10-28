import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [lightnings, setLightnings] = useState<{ id: number; x: number }[]>([]);

  useEffect(() => {
    // Lightning effect in dark mode
    const interval = setInterval(() => {
      if (document.documentElement.classList.contains("dark")) {
        const id = Date.now();
        const x = Math.random() * 100;
        setLightnings((prev) => [...prev, { id, x }]);
        
        setTimeout(() => {
          setLightnings((prev) => prev.filter((l) => l.id !== id));
        }, 500);
      }
    }, 3000 + Math.random() * 5000); // Random lightning every 3-8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Animated rain effect for dark mode */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden dark:opacity-100 opacity-0 transition-opacity duration-1000 z-0">
        {/* Rain drops */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
        
        {/* Lightning flashes */}
        {lightnings.map((lightning) => (
          <div
            key={lightning.id}
            className="lightning-flash"
            style={{ left: `${lightning.x}%` }}
          />
        ))}
        
        {/* Storm clouds overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,8%)] via-transparent to-transparent opacity-60" />
      </div>

      {/* Floating particles for light mode */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden dark:opacity-0 opacity-100 transition-opacity duration-1000 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};
