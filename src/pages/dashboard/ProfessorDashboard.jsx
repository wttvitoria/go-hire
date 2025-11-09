import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProfessorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ applications: 0, active: 0, pending: 0, rejected: 0 });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // Fetch applications
                const { data: applications, error: appError } = await supabase
                    .from('applications')
                    .select('id, status, jobs(title)')
                    .eq('professor_id', user.id);

                if (appError) throw appError;
                
                // Fetch contracts to determine final status
                const { data: contracts, error: contractError } = await supabase
                    .from('contracts')
                    .select('status')
                    .eq('professor_id', user.id);

                if (contractError) throw contractError;

                const activeContracts = contracts.filter(c => c.status === 'Ativo').length;
                const pendingContracts = contracts.filter(c => c.status === 'Pendente').length;
                const rejectedContracts = contracts.filter(c => c.status === 'Recusado').length;

                setStats({
                    applications: applications.length,
                    active: activeContracts,
                    pending: pendingContracts,
                    rejected: rejectedContracts,
                });

                setRecentApplications(applications.slice(0, 5));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const chartData = [
        { name: 'Candidaturas', value: stats.applications },
        { name: 'Contratos Ativos', value: stats.active },
        { name: 'Propostas Pendentes', value: stats.pending },
        { name: 'Propostas Recusadas', value: stats.rejected },
    ];

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
    
    const statusMap = {
      Enviada: { icon: <Clock className="h-4 w-4 text-yellow-500" />, label: 'Enviada' },
      Aceita: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'Aceita' },
      Recusada: { icon: <XCircle className="h-4 w-4 text-red-500" />, label: 'Recusada' },
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-16 h-16 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <Helmet><title>Dashboard - GO! HIRE</title></Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <h1 className="text-3xl font-bold">Meu Desempenho</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Candidaturas</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.applications}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Propostas Pendentes</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Propostas Recusadas</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo Geral</CardTitle>
                            <CardDescription>Visualização das suas atividades na plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Candidaturas Recentes</CardTitle>
                            <CardDescription>Suas últimas 5 candidaturas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentApplications.length > 0 ? (
                                <ul className="space-y-4">
                                    {recentApplications.map(app => (
                                        <li key={app.id} className="flex items-center justify-between">
                                            <span className="font-medium truncate pr-4">{app.jobs.title}</span>
                                            <Badge variant={app.status === 'Aceita' ? 'default' : app.status === 'Recusada' ? 'destructive' : 'secondary'} className="flex items-center gap-1.5">
                                              {statusMap[app.status]?.icon}
                                              {statusMap[app.status]?.label || 'Desconhecido'}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-10">Você ainda não se candidatou a nenhuma vaga.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </>
    );
};

export default ProfessorDashboard;