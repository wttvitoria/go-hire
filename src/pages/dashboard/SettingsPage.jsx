import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Loader2, Briefcase, MapPin, Phone, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Textarea } from '@/components/ui/textarea';

const SettingsPage = () => {
  const { user, profile, fetchProfile } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
    area_of_work: '',
    location: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        area_of_work: profile.area_of_work || '',
        location: profile.location || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.full_name,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        area_of_work: profileData.area_of_work,
        location: profileData.location,
        phone: profileData.phone,
      })
      .eq('id', user.id);
    
    setLoadingProfile(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível atualizar o perfil.' });
    } else {
      await fetchProfile(user);
      toast({ title: 'Sucesso', description: 'Perfil atualizado com sucesso!' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ variant: 'destructive', title: 'Erro', description: 'As senhas não correspondem.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
        toast({ variant: 'destructive', title: 'Erro', description: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
    }
    
    setLoadingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
    setLoadingPassword(false);
    
    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível atualizar a senha.' });
    } else {
      toast({ title: 'Sucesso', description: 'Senha atualizada com sucesso!' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
  };
  
  const isProfessor = profile?.role === 'professor';

  return (
    <>
      <Helmet>
        <title>Configurações - GO! HIRE</title>
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-foreground mb-8">Configurações</h1>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Profile Settings */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Perfil Público</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                  <input id="full_name" value={profileData.full_name} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2 border rounded-md" />
                </div>
              </div>
              {isProfessor && (
                <>
                  <div>
                    <Label htmlFor="area_of_work">Área de Atuação</Label>
                     <div className="relative">
                       <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                       <input id="area_of_work" value={profileData.area_of_work} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2 border rounded-md" />
                     </div>
                  </div>
                   <div>
                    <Label htmlFor="location">Localização</Label>
                     <div className="relative">
                       <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                       <input id="location" value={profileData.location} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2 border rounded-md" />
                     </div>
                  </div>
                </>
              )}
               <div>
                <Label htmlFor="phone">Telefone</Label>
                 <div className="relative">
                   <Phone className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                   <input id="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2 border rounded-md" />
                 </div>
              </div>
              <div>
                <Label htmlFor="bio">Biografia</Label>
                <Textarea id="bio" value={profileData.bio} onChange={handleProfileChange} placeholder="Fale um pouco sobre você ou sua instituição..." rows={4} />
              </div>
              <div>
                <Label htmlFor="avatar_url">URL da Foto de Perfil</Label>
                <input id="avatar_url" placeholder="https://exemplo.com/imagem.png" value={profileData.avatar_url} onChange={handleProfileChange} className="w-full px-4 py-2 border rounded-md" />
              </div>

              <Button type="submit" disabled={loadingProfile}>
                {loadingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Perfil
              </Button>
            </form>
          </div>

          {/* Account Settings */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Conta</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
               <div>
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                  <input id="email" value={user?.email || ''} disabled className="w-full pl-10 pr-4 py-2 border rounded-md bg-muted cursor-not-allowed" />
                </div>
              </div>
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                   <input id="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full pl-10 pr-4 py-2 border rounded-md" />
                 </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                   <input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full pl-10 pr-4 py-2 border rounded-md" />
                 </div>
              </div>
              <Button type="submit" disabled={loadingPassword}>
                {loadingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Alterar Senha
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsPage;