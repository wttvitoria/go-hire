
import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Link } from 'react-router-dom';
import { Loader2, User, Users, Mail, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CandidatesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null); // stores candidate.id

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) return;
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('institution_id', user.id);
      
      if (jobsError) throw jobsError;

      const jobIds = jobs.map(j => j.id);

      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          created_at,
          status,
          job_id,
          jobs ( title ),
          profiles ( id, full_name, email, phone, avatar_url )
        `)
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out candidates who already have a contract for that application
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select('application_id')
        .in('application_id', data.map(app => app.id));

      if (contractsError) throw contractsError;

      const contractedApplicationIds = contracts.map(c => c.application_id);
      const filteredCandidates = data.filter(app => !contractedApplicationIds.includes(app.id));

      setCandidates(filteredCandidates);

    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar candidatos',
        description: 'Não foi possível carregar a lista de candidatos.',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleHire = async (candidate) => {
    setIsProcessing(candidate.id);
    try {
      const { data: contractData, error } = await supabase
        .from('contracts')
        .insert({
          institution_id: user.id,
          professor_id: candidate.profiles.id,
          job_id: candidate.job_id,
          application_id: candidate.id,
          title: `Contrato para ${candidate.jobs.title}`,
          status: 'Pendente'
        }).select().single();

      if (error) throw error;

      toast({
        title: 'Proposta Enviada!',
        description: `Uma proposta de contrato foi enviada para ${candidate.profiles.full_name}.`,
      });
      
      // Remove candidate from the list after hiring
      setCandidates(prev => prev.filter(c => c.id !== candidate.id));

    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao contratar',
        description: 'Não foi possível enviar a proposta. Tente novamente.',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const openWhatsApp = (phone) => {
    if (!phone) {
        toast({ variant: 'destructive', title: 'Telefone não encontrado' });
        return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  }

  return (
    <>
      <Helmet>
        <title>Candidatos - Dashboard GO! HIRE</title>
      </Helmet>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Candidatos</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">Nenhum candidato encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ainda não há professores candidatos para as suas vagas.
            </p>
          </div>
        ) : (
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Professor</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Data da Aplicação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div className="font-medium">{candidate.profiles.full_name}</div>
                      <div className="text-sm text-muted-foreground">{candidate.profiles.email}</div>
                    </TableCell>
                    <TableCell>{candidate.jobs.title}</TableCell>
                    <TableCell>{new Date(candidate.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                         <Button variant="outline" size="sm" asChild>
                           <Link to={`/dashboard/teachers/${candidate.profiles.id}`}>
                              <User className="mr-2 h-4 w-4"/> Ver Perfil
                           </Link>
                         </Button>
                         <Button variant="outline" size="sm" onClick={() => openWhatsApp(candidate.profiles.phone)}>
                            <Phone className="mr-2 h-4 w-4"/> Mensagem
                         </Button>
                         <Button 
                            size="sm" 
                            onClick={() => handleHire(candidate)}
                            disabled={isProcessing === candidate.id}
                        >
                            {isProcessing === candidate.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Contratar
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default CandidatesPage;
