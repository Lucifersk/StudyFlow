import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { BottomNav } from "@/components/BottomNav";
import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import Planner from "./pages/Planner";
import Books from "./pages/Books";
import Group from "./pages/Group";
import Stats from "./pages/Stats";
import Insights from "./pages/Insights";
import Ranking from "./pages/Ranking";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/books" element={<Books />} />
          <Route path="/group" element={<Group />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
