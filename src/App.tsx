import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Game from "./pages/Game";
import TrialBookGame from "./pages/TrialBookGame";
import NotFound from "./pages/NotFound";
import Custombuttons from "./pages/CustomButtons";
import AdminPage from "./pages/AdminPage";
import Book1 from "./pages/books/Book1";
import Book2 from "./pages/books/Book2";    
import Book3 from "./pages/books/Book3";    
import Book4 from "./pages/books/Book4";    
import Book5 from "./pages/books/Book5";    
import Book6 from "./pages/books/Book6";    
import Book7 from "./pages/books/Book7";    
import Book8 from "./pages/books/Book8";    
import Book9 from "./pages/books/Book9";    
import Book10 from "./pages/books/Book10";    
import Book11 from "./pages/books/Book11";
import Display_Page from "./pages/testing/display_page";
import Edit_Page from "./pages/testing/edit_page";
import EditPageOne from "./pages/testing/edit_page_one";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game" element={<Game />} />
            <Route path="/game/trial-book" element={<TrialBookGame />} />
            <Route path="/custom-buttons" element={<Custombuttons />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/books/book1" element={<Book1 />} />
            <Route path="/books/book2" element={<Book2 />} />
            <Route path="/books/book3" element={<Book3 />} />
            <Route path="/books/book4" element={<Book4 />} />
            <Route path="/books/book5" element={<Book5 />} />
            <Route path="/books/book6" element={<Book6 />} />
            <Route path="/books/book7" element={<Book7 />} />
            <Route path="/books/book8" element={<Book8 />} />
            <Route path="/books/book9" element={<Book9 />} />
            <Route path="/books/book10" element={<Book10 />} />
            <Route path="/books/book11" element={<Book11 />} />
            <Route path="/testing/display_page" element={<Display_Page />} />
            <Route path="/testing/edit_page" element={<Edit_Page />} />
            <Route path="/testing/edit_page_one" element={<EditPageOne />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
