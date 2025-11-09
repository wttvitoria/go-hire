import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Briefcase, UserCheck, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const InstitutionDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ jobs: 0, candidates: 0, contracts: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // Fetch institution's jobs
                const { data: jobs, error: jobsError } = await supabase
                    .from('jobs')
                    .select('id, title, created_at')
                    .eq('institution_id', user.id);

                if (jobsError) throw jobsError;

                const jobIds = jobs.map(j => j.id);

                // Fetch candidates for these jobs
                const { count: candidatesCount, error: candidatesError } = await supabase
                    .from('applications')
                    .select('id', { count: 'exact' })
                    .in('job_id', jobIds);
                
                if (candidatesError) throw candidatesError;

                // Fetch contracts
                const { count: contractsCount, error: contractsError } = await supabase
                    .from('contracts')
                    .select('id', { count: 'exact' })
                    .eq('institution_id', user.id);

                if (contractsError) throw contractsError;

                setStats({
                    jobs: jobs.length,
                    candidates: candidatesCount,
                    contracts: contractsCount
                });

                // Prepare chart data (candidates per job)
                const candidatesPerJob = await Promise.all(jobIds.map(async (jobId) => {
                    const { count } = await supabase
                        .from('applications')
                        .select('id', { count: 'exact' })
                        .eq('job_id', jobId);
                    const job = jobs.find(j => j.id === jobId);
                    return { name: job.title, candidatos: count };
                }));

                setChartData(candidatesPerJob.slice(0, 5)); // show top 5

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

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
                <h1 className="text-3xl font-bold">Visão Geral</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.jobs}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Candidatos</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.candidates}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contratos Enviados</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.contracts}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Candidatos por Vaga</CardTitle>
                        <CardDescription>Visualização das suas 5 vagas com mais candidatos.</CardDescription>
                    </CardHeader>
                    <CardContent style={{ height: '350px' }}>
                       {chartData.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }} />
                                <Legend />
                                <Bar dataKey="candidatos" fill="#8884d8" name="Candidatos" />
                            </BarChart>
                        </ResponsiveContainer>
                       ): (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <BarChart className="w-16 h-16 text-muted-foreground" />
                            <p className="mt-4 text-sm text-muted-foreground">Nenhum dado de candidato para exibir no gráfico.</p>
                            <p className="text-xs text-muted-foreground">Publique vagas para começar a receber candidatos.</p>
                        </div>
                       )}
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default InstitutionDashboard;