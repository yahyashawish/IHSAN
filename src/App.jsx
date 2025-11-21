import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import { LandingPage, Dashboard, HalaqaTeacher, HalaqaStudent, LiveSession, Mushaf, Profile } from './pages';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/halaqa/teacher/:id" element={<ProtectedRoute><HalaqaTeacher /></ProtectedRoute>} />
      <Route path="/halaqa/student/:id" element={<ProtectedRoute><HalaqaStudent /></ProtectedRoute>} />
      <Route path="/live/:id" element={<ProtectedRoute><LiveSession /></ProtectedRoute>} />
      <Route path="/mushaf" element={<ProtectedRoute><Mushaf /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AppContextProvider>
  );
}

export default App;
