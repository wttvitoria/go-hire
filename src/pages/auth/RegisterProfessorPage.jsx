import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Briefcase, GraduationCap as GraduationCapIcon, MapPin, Phone, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const RegisterProfessorPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    area_of_work: '',
    education_level: '',
    location: '',
    phone: '',
    preferred_contract_type: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, ...metaData } = formData;
    const { error } = await signUp(email, password, { ...metaData, role: 'professor' });
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
    { id: 'full_name', label: 'Nome Completo', type: 'text', icon: User },
    { id: 'email', label: 'E-mail', type: 'email', icon: Mail },
    { id: 'password', label: 'Senha', type: 'password', icon: Lock },
    { id: 'area_of_work', label: 'Área de Atuação', type: 'text', icon: Briefcase },
    { id: 'location', label: 'Endereço ou Cidade', type: 'text', icon: MapPin },
    { id: 'phone', label: 'Telefone', type: 'tel', icon: Phone },
  ];

  return (
    <>
      <Helmet>
        <title>Cadastro de Professor - GO! HIRE</title>
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
            <h1 className="text-2xl font-bold text-foreground">Cadastro para Professores</h1>
            <p className="text-muted-foreground">Mostre seu talento e encontre a vaga ideal.</p>
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
              <div className="space-y-2">
                <Label>Nível de Ensino</Label>
                <Select onValueChange={(value) => handleSelectChange('education_level', value)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o nível" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infantil">Educação Infantil</SelectItem>
                    <SelectItem value="Fundamental I">Ensino Fundamental I</SelectItem>
                    <SelectItem value="Fundamental II">Ensino Fundamental II</SelectItem>
                    <SelectItem value="Médio">Ensino Médio</SelectItem>
                    <SelectItem value="Superior">Ensino Superior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Contrato Preferencial</Label>
                <Select onValueChange={(value) => handleSelectChange('preferred_contract_type', value)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLT">CLT</SelectItem>
                    <SelectItem value="PJ">PJ (Pessoa Jurídica)</SelectItem>
                    <SelectItem value="Temporário">Temporário</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

export default RegisterProfessorPage;