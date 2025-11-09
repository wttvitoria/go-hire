import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Save, Loader2, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha título, descrição e localização.',
      });
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from('jobs').insert({
      institution_id: user.id,
      title,
      description: JSON.stringify({ description, requirements }),
      location,
      salary: salary ? parseFloat(salary) : null,
    });

    setIsSaving(false);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar vaga',
        description: error.message,
      });
    } else {
      toast({
        title: 'Vaga criada com sucesso!',
        description: `A vaga "${title}" foi publicada.`,
      });
      navigate('/dashboard/institution-jobs');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-foreground mb-2">Publicar Nova Vaga</h1>
      <p className="text-muted-foreground mb-8">Descreva a oportunidade para atrair os melhores talentos.</p>

      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl border shadow-sm space-y-6">
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Título da Vaga (Ex: Professor de História)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Descrição detalhada da vaga e responsabilidades..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:outline-none min-h-[150px]"
            required
          />
        </div>

        <div>
           <div className="relative">
              <ListChecks className="absolute left-3 top-5 h-5 w-5 text-muted-foreground" />
              <textarea
                placeholder="Requisitos (Ex: Formação em Letras, 5 anos de experiência...)"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full pl-10 p-3 border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:outline-none min-h-[100px]"
              />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Localização (Ex: São Paulo, SP)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="number"
              placeholder="Salário (Opcional)"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {isSaving ? 'Salvando...' : 'Publicar Vaga'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateJobPage;