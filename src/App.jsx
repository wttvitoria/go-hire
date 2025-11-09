import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import RegisterInstitutionPage from '@/pages/auth/RegisterInstitutionPage';
import RegisterProfessorPage from '@/pages/auth/RegisterProfessorPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobsPage from '@/pages/JobsPage';
import JobDetailsPage from '@/pages/JobDetailsPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import { Toaster } from '@/components/ui/toaster';
import UpdatePasswordPage from '@/pages/auth/UpdatePasswordPage';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  const location = useLocation();

  const authRoutes = ['/login', '/register', '/cadastro/instituicao', '/cadastro/professor', '/forgot-password', '/update-password'];
  const isAuthPage = authRoutes.includes(location.pathname);
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  const showHeaderAndFooter = !isAuthPage && !isDashboardRoute;

  return (
    <>
      <Helmet>
        <title>GO! HIRE - Contratação de Professores</title>
        <meta name="description" content="A plataforma inteligente para conectar instituições de ensino e professores qualificados." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-background">
        {showHeaderAndFooter && <Header />}
        <main className={`flex-grow ${!showHeaderAndFooter ? '' : 'pt-20'}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cadastro/instituicao" element={<RegisterInstitutionPage />} />
            <Route path="/cadastro/professor" element={<RegisterProfessorPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            
            {/* Private Dashboard Route */}
            <Route 
              path="/dashboard/*" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
        {showHeaderAndFooter && <Footer />}
      </div>
      <Toaster />
    </>
  );
}

export default App;