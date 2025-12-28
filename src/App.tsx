import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { Work } from "./pages/Work";
import { Blog } from "./pages/Blog";
import { Gallery } from "./pages/Gallery";
import { ProjectDetail } from "./pages/ProjectDetail";
import { ProjectEdit } from "./pages/ProjectEdit";
import { Login } from "./pages/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import { Navigation } from "./components/Navigation";
import { AnimatedBackground } from "./components/AnimatedBackground";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <AnimatedBackground />
        <Navigation />
        <Home />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <AnimatedBackground />
        <Navigation />
        <AboutPage />
      </>
    ),
  },
  {
    path: "/work",
    element: (
      <>
        <AnimatedBackground />
        <Navigation />
        <Work />
      </>
    ),
  },
  {
    path: "/work/:id",
    element: (
      <>
        <AnimatedBackground />
        <Navigation />
        <ProjectDetail />
      </>
    ),
  },
  {
    path: "/blog",
    element: (
      <>
        <AnimatedBackground />
        <Navigation />
        <Blog />
      </>
    ),
  },
  {
    path: "/gallery",
    element: (
      <>
        <AnimatedBackground />
        <Navigation />
        <Gallery />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <AnimatedBackground />
        <Login />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <Home isEditable />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/about",
    element: (
      <DashboardLayout>
        <AboutPage isEditable />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/work",
    element: (
      <DashboardLayout>
        <Work isEditable />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/work/:id/edit",
    element: (
      <DashboardLayout>
        <ProjectEdit />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/work/:id",
    element: (
      <DashboardLayout>
        <ProjectDetail isEditable />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/blog",
    element: (
      <DashboardLayout>
        <Blog isEditable />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard/gallery",
    element: (
      <DashboardLayout>
        <Gallery isEditable />
      </DashboardLayout>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
], { basename: import.meta.env.MODE === 'development' ? "/live-edit-desk/" : "/" });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
