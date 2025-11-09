import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, MapPin, DollarSign, Briefcase, Building, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [job, setJob] = useState(null);
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const checkApplication = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('professor_id', user.id)
        .maybeSingle(); // Corrigido de .single() para .maybeSingle()
      if (error) throw error;
      setHasApplied(!!data);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  }, [id, user]);

  const fetchJobDetails = useCallback(async () => {
    setLoading(true);
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      if (jobData) {
        const { data: institutionData, error: institutionError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', jobData.institution_id)
          .single();
        if (institutionError) throw institutionError;
        setInstitution(institutionData);
      }
      
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast({
        variant: "destructive",
        title: "Erro ao Carregar Vaga",
        description: "Não foi possível encontrar os detalhes desta vaga.",
      });
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  }, [id, toast, navigate]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  useEffect(() => {
    if (job && user) {
      checkApplication();
    }
  }, [job, user, checkApplication]);

  const handleApply = async () => {
    if (!user) {
      toast({ title: 'Acesso Negado', description: 'Você precisa estar logado para se candidatar.' });
      return;
    }
    if (profile?.role !== 'professor') {
        toast({ title: 'Acesso Negado', description: 'Apenas professores podem se candidatar a vagas.' });
        return;
    }

    setIsApplying(true);
    try {
        const { error } = await supabase.from('applications').insert({
            job_id: id,
            professor_id: user.id,
            status: 'Enviada',
        });
        if (error) throw error;
        toast({ title: 'Sucesso!', description: 'Sua candidatura foi enviada. Boa sorte!' });
        setHasApplied(true);
    } catch (error) {
        console.error('Error applying for job:', error);
        toast({
            variant: "destructive",
            title: "Erro na Candidatura",
            description: "Não foi possível enviar sua candidatura. Tente novamente mais tarde.",
        });
    } finally {
        setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Vaga não encontrada</h1>
            <p className="text-muted-foreground">A vaga que você procura pode ter sido removida ou não existe.</p>
            <Button asChild>
                <Link to="/jobs">Voltar para as Vagas</Link>
            </Button>
        </div>
      </div>
    );
  }

  const { title, details, location, salary } = job;
  const { area = "Não especificado", description = "Sem descrição.", requirements = "Não especificado" } = details || {};

  return (
    <>
      <Helmet>
        <title>{title} - GO! HIRE</title>
        <meta name="description" content={description.substring(0, 160)} />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl shadow-lg border p-8 max-w-4xl mx-auto"
          >
            <header className="mb-8 border-b pb-6">
              <Badge variant="secondary" className="mb-2">{area}</Badge>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
              <div className="flex items-center gap-4 mt-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{institution?.full_name || 'Instituição Confidencial'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
              </div>
            </header>

            <main className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-primary mb-4">Descrição da Vaga</h2>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{description}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-primary mb-4">Requisitos</h2>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{requirements}</p>
                </section>
              </div>
              <aside className="md:col-span-1">
                <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg border">
                    <h3 className="font-bold text-lg text-foreground mb-4">Resumo da Vaga</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Salário</p>
                                <p className="font-semibold text-foreground">R$ {salary ? salary.toFixed(2) : 'A combinar'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Tipo de Contrato</p>
                                <p className="font-semibold text-foreground">{details?.contractType || 'Não especificado'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        {profile?.role === 'professor' && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="w-full text-lg py-6" disabled={hasApplied || isApplying}>
                                        {isApplying && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                        {hasApplied ? 'Candidatura Enviada' : 'Aplicar para esta vaga'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmar Candidatura</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Você está prestes a se candidatar para a vaga de <span className="font-bold">{title}</span>. 
                                            Seu perfil será enviado para <span className="font-bold">{institution?.full_name}</span>. Deseja continuar?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleApply}>Confirmar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                         {profile?.role === 'institution' && (
                            <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-md border border-yellow-300 dark:border-yellow-700">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">Instituições não podem se candidatar a vagas.</p>
                            </div>
                         )}
                         {!user && (
                            <Button className="w-full text-lg py-6" asChild>
                                <Link to={`/login?redirect=/jobs/${id}`}>Faça login para se candidatar</Link>
                            </Button>
                         )}
                    </div>
                </div>
              </aside>
            </main>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default JobDetailsPage;