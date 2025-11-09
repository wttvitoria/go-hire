
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, Edit, Trash2, Loader2, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const JobCard = ({ job, onEdit, onDelete }) => (
  <div className="bg-card p-5 rounded-lg border shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
    <div>
      <h3 className="font-bold text-lg text-foreground truncate">{job.title}</h3>
      <p className="text-sm text-muted-foreground">{job.location}</p>
      <Link to={`/dashboard/jobs/${job.id}/candidates`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-2">
        <Users className="w-3 h-3"/>
        {job.applications_count || 0} candidatura(s)
      </Link>
    </div>
    <div className="flex items-center justify-end space-x-2 mt-4">
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/jobs/${job.id}`}><Eye className="w-4 h-4" /></Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onEdit(job)}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(job.id)}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const EditJobModal = ({ job, isOpen, onClose, onSave }) => {
    const [editedJob, setEditedJob] = useState(job);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditedJob(job);
    }, [job]);

    if (!job) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedJob(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(editedJob);
        setIsSaving(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Editar Vaga</AlertDialogTitle>
                    <AlertDialogDescription>
                        Faça as alterações necessárias e clique em salvar.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    <input name="title" value={editedJob.title} onChange={handleChange} placeholder="Título" className="w-full p-2 border rounded-lg bg-input"/>
                    <textarea name="description" value={editedJob.description} onChange={handleChange} placeholder="Descrição" className="w-full p-2 border rounded-lg bg-input min-h-[100px]"/>
                    <input name="location" value={editedJob.location} onChange={handleChange} placeholder="Localização" className="w-full p-2 border rounded-lg bg-input"/>
                    <input name="salary" type="number" value={editedJob.salary || ''} onChange={handleChange} placeholder="Salário" className="w-full p-2 border rounded-lg bg-input"/>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                        Salvar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const InstitutionJobsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    // Fetch jobs and the count of applications for each job
    const { data, error } = await supabase
      .from('jobs')
      .select('*, applications(count)')
      .eq('institution_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar vagas', description: error.message });
    } else {
      const formattedJobs = data.map(job => ({
        ...job,
        applications_count: job.applications[0]?.count || 0
      }));
      setJobs(formattedJobs);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDeleteClick = (jobId) => {
    setJobToDelete(jobId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    const { error } = await supabase.from('jobs').delete().eq('id', jobToDelete);
    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao deletar vaga', description: error.message });
    } else {
      toast({ title: 'Vaga deletada com sucesso' });
      fetchJobs();
    }
    setIsDeleteAlertOpen(false);
    setJobToDelete(null);
  };

  const handleEditClick = (job) => {
    setJobToEdit(job);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedJob) => {
    const { error } = await supabase
        .from('jobs')
        .update({
            title: updatedJob.title,
            description: updatedJob.description,
            location: updatedJob.location,
            salary: updatedJob.salary
        })
        .eq('id', updatedJob.id);

    if (error) {
        toast({ variant: 'destructive', title: 'Erro ao atualizar vaga', description: error.message });
    } else {
        toast({ title: 'Vaga atualizada com sucesso' });
        fetchJobs();
    }
    setIsEditModalOpen(false);
    setJobToEdit(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Minhas Vagas</h1>
        <Button asChild>
          <Link to="/dashboard/jobs/new">
            <PlusCircle className="w-5 h-5 mr-2" />
            Publicar Nova Vaga
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={handleEditClick} onDelete={handleDeleteClick}/>
          ))}
        </div>
      ) : (
        <div className="text-center bg-card border rounded-lg py-16 px-6">
          <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Nenhuma Vaga Publicada</h2>
          <p className="text-muted-foreground">Clique em "Publicar Nova Vaga" para começar a contratar.</p>
        </div>
      )}
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente a vaga e remover todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {jobToEdit && (
        <EditJobModal 
            job={jobToEdit}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEdit}
        />
      )}
    </motion.div>
  );
};

export default InstitutionJobsPage;
