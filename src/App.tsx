import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { Work } from "./pages/Work";
import { Blog } from "./pages/Blog";
import { Gallery } from "./pages/Gallery";
import { Login } from "./pages/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import { Navigation } from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navigation /><Home /></>} />
          <Route path="/about" element={<><Navigation /><AboutPage /></>} />
          <Route path="/work" element={<><Navigation /><Work /></>} />
          <Route path="/blog" element={<><Navigation /><Blog /></>} />
          <Route path="/gallery" element={<><Navigation /><Gallery /></>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard Routes - Editable Mode */}
          <Route path="/dashboard" element={<DashboardLayout><Home isEditable /></DashboardLayout>} />
          <Route path="/dashboard/about" element={<DashboardLayout><AboutPage isEditable /></DashboardLayout>} />
          <Route path="/dashboard/work" element={<DashboardLayout><Work isEditable /></DashboardLayout>} />
          <Route path="/dashboard/blog" element={<DashboardLayout><Blog isEditable /></DashboardLayout>} />
          <Route path="/dashboard/gallery" element={<DashboardLayout><Gallery isEditable /></DashboardLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
