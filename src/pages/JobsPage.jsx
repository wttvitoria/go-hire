import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select('*, institution:institution_id(full_name)');

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      if (locationFilter) {
        query = query.ilike('location', `%${locationFilter}%`);
      }
      
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar vagas',
          description: error.message,
        });
      } else {
        const formattedJobs = data.map(job => ({
            ...job,
            institutionName: job.institution?.full_name || 'Instituição não informada'
        }));
        setJobs(formattedJobs);
      }
      setLoading(false);
    };

    const searchTimeout = setTimeout(() => {
        fetchJobs();
    }, 500); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, locationFilter, toast]);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Encontre a sua
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600"> Vaga Ideal</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore as melhores oportunidades em instituições de ensino de todo o país. A sua próxima grande jornada começa aqui.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card p-6 rounded-2xl shadow-lg border max-w-4xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative col-span-1 md:col-span-2">
            <label htmlFor="search-term" className="block text-sm font-medium text-foreground mb-1">
              O que você procura?
            </label>
            <Search className="absolute left-3 top-9 h-5 w-5 text-muted-foreground" />
            <input
              id="search-term"
              type="text"
              placeholder="Ex: Professor de Matemática"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="relative">
            <label htmlFor="location-filter" className="block text-sm font-medium text-foreground mb-1">
              Localização
            </label>
            <MapPin className="absolute left-3 top-9 h-5 w-5 text-muted-foreground" />
            <input
              id="location-filter"
              type="text"
              placeholder="Ex: São Paulo"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/jobs/${job.id}`} className="block h-full">
                <div className="bg-card rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col h-full border hover:border-primary/50">
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">Novo</span>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-primary" />
                        <span>{job.institutionName}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-primary" />
                          <span>R$ {job.salary.toLocaleString('pt-BR')} / mês</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <Button variant="link" className="text-primary font-bold">Ver Detalhes &rarr;</Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Nenhuma vaga encontrada</h3>
            <p className="text-muted-foreground mt-2">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;