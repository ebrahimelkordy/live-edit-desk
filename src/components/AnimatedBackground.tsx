import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
  const rainIframeRef = useRef<HTMLIFrameElement>(null);
  const lightIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (rainIframeRef.current) {
        rainIframeRef.current.style.opacity = isDark ? "1" : "0";
      }
      if (lightIframeRef.current) {
        lightIframeRef.current.style.opacity = isDark ? "0" : "1";
      }
    };

    // Initial theme check
    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Force dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Rain wallpaper for dark mode */}
      <iframe
        ref={rainIframeRef}
        src="/src/wallpapers/rain.html"
        className="absolute inset-0 w-full h-full border-0 opacity-0 transition-opacity duration-1000"
        style={{ opacity: 0 }}
      />

      {/* Light wallpaper for light mode */}
      <iframe
        ref={lightIframeRef}
        src="/src/wallpapers/light.html"
        className="absolute inset-0 w-full h-full border-0 opacity-1 transition-opacity duration-1000"
        style={{ opacity: 1 }}
      />
    </div>
  );
};
