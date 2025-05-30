import { AuthProvider } from "./contexts/AuthContext";
import { BibleVerseProvider } from "./contexts/BibleContext"; // <-- Correct import
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import NotePage from "./pages/NotePage";
import './App.css'

function AppContent() {
  const { token } = useAuth();
  return token ? <NotePage /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BibleVerseProvider>
        <AppContent />
      </BibleVerseProvider>
    </AuthProvider>
  );
}
