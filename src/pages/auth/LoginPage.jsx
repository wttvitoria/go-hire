import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth(); // Corrigido de signInWithEmail para signIn
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password); // Corrigido de signInWithEmail para signIn
    setLoading(false);
    if (!error) {
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o seu painel...",
      });
      navigate('/dashboard');
    }
    // A notificação de erro já é tratada dentro do hook signIn
  };

  return (
    <>
      <Helmet>
        <title>Login - GO! HIRE</title>
      </Helmet>
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'\%23e5e7eb\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8 border"
        >
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center gap-2 group mb-4">
              <ArrowUpDown className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold text-foreground">GO! HIRE</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo(a) de volta!</h1>
            <p className="text-muted-foreground">Faça login para acessar seu painel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" tabIndex={-1} className="text-sm font-medium text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 w-5 h-5" />
              )}
              Entrar
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;