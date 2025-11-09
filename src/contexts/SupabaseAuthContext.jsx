import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', currentUser.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      toast({
        variant: "destructive",
        title: "Erro ao buscar perfil",
        description: "Não foi possível carregar as informações do seu perfil.",
      });
      setProfile(null);
    }
  }, [toast]);

  const handleAuthChange = useCallback(async (_event, session) => {
    setLoading(true);
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    await fetchProfile(currentUser);
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
        handleAuthChange(null, session);
    });

    return () => subscription.unsubscribe();
  }, [handleAuthChange]);

  const signUp = useCallback(async (email, password, metaData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metaData,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falha no Cadastro",
        description: error.message || "Não foi possível criar sua conta. Verifique os dados e tente novamente.",
      });
    }

    return { user: data.user, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let description = "Ocorreu um erro inesperado. Tente novamente.";
      if (error.message === 'Invalid login credentials') {
          description = "E-mail ou senha inválidos. Por favor, verifique seus dados e tente novamente.";
      }
      toast({
          variant: "destructive",
          title: "Falha no Login",
          description: description,
      });
    }
    
    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Falha ao Sair",
        description: "Ocorreu um erro ao tentar sair da sua conta.",
      });
    }
    return { error };
  }, [toast]);

  const resetPasswordForEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
        toast({
            variant: "destructive",
            title: "Falha ao Enviar",
            description: "Não foi possível enviar o e-mail de recuperação. Verifique o e-mail digitado.",
        });
    } else {
        toast({
            title: "E-mail de Recuperação Enviado",
            description: "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
        });
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPasswordForEmail,
    fetchProfile,
  }), [user, session, profile, loading, signUp, signIn, signOut, resetPasswordForEmail, fetchProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};