import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building, Mail, MapPin, User, Briefcase, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const MyInstitutionPage = () => {
  const { profile, fetchProfile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    cnpj: '',
    area_of_work: '',
    address: '',
    responsible_name: '',
    responsible_role: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        cnpj: profile.cnpj || '',
        area_of_work: profile.area_of_work || '',
        address: profile.address || '',
        responsible_name: profile.responsible_name || '',
        responsible_role: profile.responsible_role || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', profile.id);
    
    setLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
      });
    } else {
      await fetchProfile(profile);
      toast({
        title: 'Sucesso!',
        description: 'As informações da sua instituição foram atualizadas.',
      });
    }
  };

  const inputFields = [
    { id: 'full_name', label: 'Nome da Instituição', icon: Building },
    { id: 'cnpj', label: 'CNPJ', icon: Briefcase },
    { id: 'area_of_work', label: 'Área de Atuação', icon: Briefcase },
    { id: 'address', label: 'Endereço', icon: MapPin },
    { id: 'responsible_name', label: 'Nome do Responsável', icon: User },
    { id: 'responsible_role', label: 'Cargo do Responsável', icon: User },
  ];

  return (
    <>
      <Helmet>
        <title>Minha Instituição - GO! HIRE</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Minha Instituição</h1>
        <p className="text-muted-foreground mb-8">
          Gerencie e atualize as informações da sua instituição.
        </p>

        <div className="bg-card p-8 rounded-lg border shadow-sm max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map(({ id, label, icon: Icon }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id={id}
                      type="text"
                      value={formData[id]}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default MyInstitutionPage;