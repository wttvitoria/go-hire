import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, ChevronLeft } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TeacherProfilePage = () => {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTeacherProfile = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .eq('role', 'professor')
                .single();

            if (error) throw error;
            setTeacher(data);
        } catch (error) {
            console.error('Error fetching teacher profile:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTeacherProfile();
    }, [fetchTeacherProfile]);

    const getInitials = (name) => {
        if (!name) return '..';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-16 h-16 animate-spin text-primary" /></div>;
    }

    if (!teacher) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Professor não encontrado</h1>
                <p className="text-muted-foreground">O perfil que você está tentando acessar não existe ou não é de um professor.</p>
                <Button asChild className="mt-4"><Link to="/dashboard/teachers">Voltar</Link></Button>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{teacher.full_name} - Perfil | GO! HIRE</title>
            </Helmet>
            <motion.div
                className="container mx-auto px-4 py-8 max-w-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-6">
                    <Button variant="ghost" asChild>
                        <Link to="/dashboard/teachers"><ChevronLeft className="w-4 h-4 mr-2" />Voltar para Talentos</Link>
                    </Button>
                </div>
                <div className="md:flex gap-8">
                    {/* Left Column */}
                    <motion.div
                        className="md:w-1/3 mb-8 md:mb-0"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Card className="p-6 text-center shadow-lg">
                            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
                                <AvatarImage src={teacher.avatar_url} alt={teacher.full_name} />
                                <AvatarFallback className="text-4xl">{getInitials(teacher.full_name)}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-2xl font-bold">{teacher.full_name}</h1>
                            <p className="text-muted-foreground">{teacher.area_of_work}</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary">{teacher.preferred_contract_type || 'Flexível'}</Badge>
                                <Badge variant="secondary">{teacher.education_level || 'Não informado'}</Badge>
                            </div>
                        </Card>
                        <Card className="mt-6 p-6 shadow-lg">
                            <h3 className="font-bold mb-4 text-lg">Contato</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <span className="truncate">{teacher.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span>{teacher.phone || 'Não informado'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>{teacher.location || 'Não informado'}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                    
                    {/* Right Column */}
                    <motion.div
                        className="md:w-2/3"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Sobre Mim</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{teacher.bio || 'Nenhuma biografia fornecida.'}</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Experiência</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Mock data */}
                                    <ul className="space-y-3 text-sm list-disc list-inside text-muted-foreground">
                                        <li>Professor de Matemática na Escola XYZ (2018-2023)</li>
                                        <li>Coordenador de Olimpíadas de Matemática (2020-2023)</li>
                                        <li>Tutor Particular de Cálculo (2016-2018)</li>
                                    </ul>
                                </CardContent>
                            </Card>
                             <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> Formação</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Mock data */}
                                     <ul className="space-y-3 text-sm list-disc list-inside text-muted-foreground">
                                        <li>Mestrado em Educação Matemática - USP (2018)</li>
                                        <li>Licenciatura em Matemática - UNICAMP (2016)</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};

export default TeacherProfilePage;