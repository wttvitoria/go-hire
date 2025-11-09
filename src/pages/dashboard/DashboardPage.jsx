
import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  DollarSign,
  BarChart2,
  Building,
  LogOut,
  Settings,
  LifeBuoy,
  UserCheck,
  GraduationCap,
  ArrowUpDown
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

// Import all dashboard pages
import ProfessorDashboard from './ProfessorDashboard';
import InstitutionDashboard from './InstitutionDashboard';
import InstitutionJobsPage from './InstitutionJobsPage';
import CreateJobPage from './CreateJobPage';
import CandidatesPage from './CandidatesPage';
import ContractsPage from './ContractsPage';
import BudgetsPage from './BudgetsPage';
import ReportsPage from './ReportsPage';
import MyInstitutionPage from './MyInstitutionPage';
import StaffPage from './StaffPage';
import SupportPage from './SupportPage';
import SettingsPage from './SettingsPage';
import TeachersPage from './TeachersPage';
import TeacherProfilePage from '../TeacherProfilePage';
import JobsPage from '../JobsPage'; // Import the public JobsPage

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === `/dashboard${to}`;
  return (
    <Link
      to={`/dashboard${to}`}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </Link>
  );
};

const DashboardLayout = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
      toast({
        title: "Você saiu!",
        description: "Até a próxima!",
      });
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '..';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isProfessor = profile?.role === 'professor';
  const isInstitution = profile?.role === 'institution';
  
  const professorNav = [
    { to: '', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Briefcase, label: 'Vagas' },
    { to: '/contracts', icon: FileText, label: 'Contratos' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
    { to: '/support', icon: LifeBuoy, label: 'Suporte' },
  ];
  
  const institutionNav = [
    { to: '', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Briefcase, label: 'Vagas' },
    { to: '/candidates', icon: UserCheck, label: 'Candidatos' },
    { to: '/teachers', icon: GraduationCap, label: 'Professores' },
    { to: '/contracts', icon: FileText, label: 'Contratos' },
    { to: '/budgets', icon: DollarSign, label: 'Orçamentos' },
    { to: '/reports', icon: BarChart2, label: 'Relatórios' },
    { to: '/my-institution', icon: Building, label: 'Minha Instituição' },
    // Removed "Equipe" menu item
    // { to: '/staff', icon: Users, label: 'Equipe' }, 
    { to: '/support', icon: LifeBuoy, label: 'Suporte' },
  ];

  const navItems = isProfessor ? professorNav : isInstitution ? institutionNav : [];

  return (
    <div className="flex h-screen bg-background">
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="w-64 flex-shrink-0 border-r bg-card flex flex-col"
      >
        <div className="h-20 flex items-center px-6 border-b">
           <Link to="/" className="flex items-center gap-2 group">
              <ArrowUpDown className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">GO! HIRE</span>
            </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => <SidebarLink key={item.to} to={item.to} icon={item.icon}>{item.label}</SidebarLink>)}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
             <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">{getInitials(profile?.full_name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 p-4 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

const DashboardPage = () => {
    const { profile, loading } = useAuth();
    if (loading) return null;

    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={
                    profile?.role === 'professor' ? <ProfessorDashboard /> :
                    profile?.role === 'institution' ? <InstitutionDashboard /> :
                    <Navigate to="/login" />
                } />
                <Route path="jobs" element={
                    profile?.role === 'professor' ? <JobsPage /> : 
                    <InstitutionJobsPage />
                } />
                <Route path="jobs/new" element={<CreateJobPage />} />
                <Route path="candidates" element={<CandidatesPage />} />
                <Route path="teachers" element={<TeachersPage />} />
                <Route path="teachers/:id" element={<TeacherProfilePage />} />
                <Route path="contracts" element={<ContractsPage />} />
                <Route path="budgets" element={<BudgetsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="my-institution" element={<MyInstitutionPage />} />
                <Route path="staff" element={<StaffPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="settings" element={<SettingsPage />} />
                 <Route path="*" element={<h1 className="text-2xl font-bold">Página não encontrada</h1>} />
            </Routes>
        </DashboardLayout>
    );
}

export default DashboardPage;
