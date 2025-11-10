import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Mail, Lock, User, Briefcase, MapPin, Phone, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const RegisterInstitutionPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    cnpj: '',
    area_of_work: '',
    address: '',
    email: '',
    password: '',
    responsible_name: '',
    responsible_role: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, ...metaData } = formData;
    const { error } = await signUp(email, password, { ...metaData, role: 'institution' });
    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message,
      });
    } else {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu e-mail para confirmar sua conta.",
      });
      navigate('/login');
    }
  };

  const inputFields = [
    { id: 'full_name', label: 'Nome da Instituição', type: 'text', icon: Building },
    { id: 'cnpj', label: 'CNPJ', type: 'text', icon: Briefcase },
    { id: 'area_of_work', label: 'Área de Atuação', type: 'text', icon: Briefcase },
    { id: 'address', label: 'Endereço', type: 'text', icon: MapPin },
    { id: 'email', label: 'E-mail', type: 'email', icon: Mail },
    { id: 'password', label: 'Senha', type: 'password', icon: Lock },
    { id: 'responsible_name', label: 'Nome do Responsável', type: 'text', icon: User },
    { id: 'responsible_role', label: 'Cargo do Responsável', type: 'text', icon: User },
  ];

  return (
    <>
      <Helmet>
        <title>Cadastro de Instituição - GO! HIRE</title>
      </Helmet>
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'\%23e5e7eb\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl p-8 border"
        >
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center gap-2 group mb-4">
              <ArrowUpDown className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold text-foreground">GO! HIRE</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Cadastro para Instituições</h1>
            <p className="text-muted-foreground">Encontre os melhores talentos para sua equipe.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map(({ id, label, type, icon: Icon }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id={id}
                      type={type}
                      required
                      value={formData[id]}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={loading}>
              {loading ? 'Finalizando...' : 'Finalizar Cadastro'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/register" className="text-sm font-medium text-primary hover:underline flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterInstitutionPage;