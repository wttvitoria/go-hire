import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Briefcase, Users, FileCheck, CalendarClock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ReportsPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalCandidates: 0,
        hiringRate: 0,
        avgTimeToHire: 0, // Mocked for now
    });
    const [candidatesPerJob, setCandidatesPerJob] = useState([]);
    const [contractStatusData, setContractStatusData] = useState([]);
    const [candidatesOverTime, setCandidatesOverTime] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportsData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // Fetch jobs, applications, and contracts for the institution
                const { data: jobs, error: jobsError } = await supabase
                    .from('jobs').select('id, title').eq('institution_id', user.id);
                if (jobsError) throw jobsError;

                const jobIds = jobs.map(j => j.id);

                const { data: applications, error: appsError } = await supabase
                    .from('applications').select('id, job_id, created_at').in('job_id', jobIds);
                if (appsError) throw appsError;

                const { data: contracts, error: contractsError } = await supabase
                    .from('contracts').select('status').eq('institution_id', user.id);
                if (contractsError) throw contractsError;

                // Calculate stats
                const totalJobs = jobs.length;
                const totalCandidates = applications.length;
                const activeContracts = contracts.filter(c => c.status === 'Ativo').length;
                const hiringRate = totalCandidates > 0 ? (activeContracts / totalCandidates) * 100 : 0;

                setStats({
                    totalJobs,
                    totalCandidates,
                    hiringRate: hiringRate.toFixed(1),
                    avgTimeToHire: 14, // Mock data
                });

                // Candidates per job chart
                const candidatesCount = jobs.map(job => ({
                    name: job.title,
                    candidatos: applications.filter(app => app.job_id === job.id).length,
                })).sort((a, b) => b.candidatos - a.candidatos).slice(0, 5);
                setCandidatesPerJob(candidatesCount);

                // Contract status chart
                const statusCounts = contracts.reduce((acc, contract) => {
                    acc[contract.status] = (acc[contract.status] || 0) + 1;
                    return acc;
                }, {});
                const contractData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
                setContractStatusData(contractData);

                // Candidates over time
                const candidatesByMonth = applications.reduce((acc, app) => {
                    const month = new Date(app.created_at).toLocaleString('default', { month: 'short', year: '2-digit' });
                    acc[month] = (acc[month] || 0) + 1;
                    return acc;
                }, {});
                const overTimeData = Object.keys(candidatesByMonth).map(month => ({
                    name: month,
                    candidatos: candidatesByMonth[month]
                })).reverse(); // Simple sort
                setCandidatesOverTime(overTimeData);

            } catch (error) {
                console.error("Error fetching reports data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReportsData();
    }, [user]);

    const PIE_COLORS = ['#82ca9d', '#ffc658', '#ff8042'];

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-16 h-16 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <Helmet><title>Relatórios - GO! HIRE</title></Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <h1 className="text-3xl font-bold">Relatórios de Contratação</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vagas Publicadas</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.totalJobs}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Candidatos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.totalCandidates}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Taxa de Contratação</CardTitle>
                            <FileCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.hiringRate}%</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tempo Médio para Contratar</CardTitle>
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.avgTimeToHire} dias</div></CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 5 Vagas por Candidatos</CardTitle>
                        </CardHeader>
                        <CardContent style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={candidatesPerJob} layout="vertical" margin={{ right: 30 }}>
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }} />
                                    <Bar dataKey="candidatos" fill="#8884d8" name="Candidatos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Status dos Contratos</CardTitle>
                        </CardHeader>
                        <CardContent style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={contractStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {contractStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Novos Candidatos por Mês</CardTitle>
                    </CardHeader>
                    <CardContent style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={candidatesOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="candidatos" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default ReportsPage;