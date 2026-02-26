import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import StudentsPage from "@/pages/trainer/StudentsPage";
import RoutinesPage from "@/pages/trainer/RoutinesPage";
import PlansPage from "@/pages/trainer/PlansPage";
import TrackingPage from "@/pages/trainer/TrackingPage";
import TodayRoutinePage from "@/pages/student/TodayRoutinePage";
import MyPlansPage from "@/pages/student/MyPlansPage";
import ProgressPage from "@/pages/student/ProgressPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/trainer/students" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/trainer/students" element={<StudentsPage />} />
            <Route path="/trainer/routines" element={<RoutinesPage />} />
            <Route path="/trainer/plans" element={<PlansPage />} />
            <Route path="/trainer/tracking" element={<TrackingPage />} />
            <Route path="/student/today" element={<TodayRoutinePage />} />
            <Route path="/student/plans" element={<MyPlansPage />} />
            <Route path="/student/progress" element={<ProgressPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
