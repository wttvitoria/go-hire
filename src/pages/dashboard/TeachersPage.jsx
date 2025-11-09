import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, User, Search, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'professor');

    if (searchTerm) {
      query = query.or(`full_name.ilike.%${searchTerm}%,area_of_work.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query.order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching teachers:', error);
    } else {
      setTeachers(data);
    }
    setLoading(false);
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTeachers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTeachers]);
  
  const getInitials = (name) => {
    if (!name) return '..';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Helmet>
        <title>Buscar Professores - GO! HIRE</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Banco de Talentos</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome, área, localização..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
             <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">Nenhum professor encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente ajustar os termos da sua busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex-grow flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                      <AvatarImage src={teacher.avatar_url} alt={teacher.full_name} />
                      <AvatarFallback className="text-3xl bg-muted">{getInitials(teacher.full_name)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{teacher.full_name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{teacher.location}</p>
                    <Badge variant="secondary" className="mb-4">{teacher.area_of_work}</Badge>
                    <p className="text-sm text-muted-foreground flex-grow line-clamp-3">
                      {teacher.bio || 'Professor ainda não adicionou uma biografia.'}
                    </p>
                  </CardContent>
                  <div className="p-4 border-t">
                      <Button asChild className="w-full">
                        <Link to={`/dashboard/teachers/${teacher.id}`}>
                            <User className="mr-2 h-4 w-4"/> Ver Perfil Completo
                        </Link>
                      </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default TeachersPage;