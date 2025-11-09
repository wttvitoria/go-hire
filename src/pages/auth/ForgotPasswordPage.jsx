import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, Loader2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState(''); // Corrected: changed setLoading to setEmail
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPasswordForEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    await resetPasswordForEmail(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Recuperar Senha - GO! HIRE</title>
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
            <h1 className="text-2xl font-bold text-foreground">Recuperar Senha</h1>
            <p className="text-muted-foreground">
              {submitted 
                ? "Se uma conta com este e-mail existir, um link de recuperação foi enviado."
                : "Digite seu e-mail para receber um link de recuperação."
              }
            </p>
          </div>

          {!submitted ? (
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 w-5 h-5" />
                )}
                Enviar Link
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">Verifique sua caixa de entrada (e pasta de spam) para continuar.</p>
              <Button asChild variant="outline">
                <Link to="/login">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Voltar para o Login
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-medium text-primary hover:underline flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Lembrou a senha? Voltar para o login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;