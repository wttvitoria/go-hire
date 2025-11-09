import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, FileText, CheckCircle, XCircle, Clock, MessageSquare, Check, X, Send } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

const Chat = ({ contractId }) => {
    const { user, profile } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contract_messages')
            .select('*, sender:sender_id (full_name)')
            .eq('contract_id', contractId)
            .order('created_at', { ascending: true });

        if (error) console.error("Error fetching messages:", error);
        else setMessages(data);
        setLoading(false);
    }, [contractId]);

    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel(`contract-chat-${contractId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contract_messages', filter: `contract_id=eq.${contractId}` },
                (payload) => {
                    // This is a workaround because the new record doesn't have the sender info immediately.
                    // A better solution would be to re-fetch or structure the payload differently.
                    setTimeout(fetchMessages, 500);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [contractId, fetchMessages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const { error } = await supabase.from('contract_messages').insert({
            contract_id: contractId,
            sender_id: user.id,
            content: newMessage,
        });

        if (error) {
            console.error("Error sending message:", error);
        } else {
            setNewMessage('');
        }
    };
    
    if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto mt-4" />;

    return (
        <div className="mt-4 border-t pt-4">
             <h4 className="font-semibold mb-2">Chat Rápido</h4>
             <div className="h-48 overflow-y-auto bg-muted/50 p-3 rounded-md space-y-3 mb-2">
                 {messages.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-10">Nenhuma mensagem ainda.</p>
                 ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                            <div className={`text-xs text-muted-foreground mb-0.5 ${msg.sender_id === user.id ? 'text-right' : 'text-left'}`}>
                                {msg.sender.full_name}
                            </div>
                            <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${msg.sender_id === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                 )}
             </div>
             <form onSubmit={handleSendMessage} className="flex gap-2">
                 <Input 
                    placeholder="Digite sua mensagem..." 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                 />
                 <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
             </form>
        </div>
    );
};


const ContractsPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase.from('contracts').select(`
      id,
      title,
      status,
      created_at,
      institution:institution_id ( full_name, phone ),
      professor:professor_id ( full_name )
    `);

    if (profile.role === 'professor') {
      query = query.eq('professor_id', user.id);
    } else if (profile.role === 'institution') {
      query = query.eq('institution_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar contratos', description: error.message });
      console.error(error);
    } else {
      setContracts(data);
    }
    setLoading(false);
  }, [user, profile, toast]);

  useEffect(() => {
    if (!authLoading) {
      fetchContracts();
    }
  }, [authLoading, fetchContracts]);

  const handleUpdateStatus = async (contractId, newStatus, contract) => {
    const { error } = await supabase
      .from('contracts')
      .update({ status: newStatus })
      .eq('id', contractId);

    if (error) {
      toast({ variant: 'destructive', title: `Erro ao ${newStatus === 'Ativo' ? 'aceitar' : 'recusar'} contrato`, description: error.message });
    } else {
      toast({ title: 'Sucesso!', description: `Contrato ${newStatus === 'Ativo' ? 'aceito' : 'recusado'} com sucesso.` });
      
      if (newStatus === 'Ativo' && profile.role === 'professor' && contract.institution.phone) {
        const institutionName = contract.institution.full_name;
        const jobTitle = contract.title;
        const message = `Olá, ${institutionName}! Estou entrando em contato para confirmar que aceitei a proposta para a vaga de "${jobTitle}". Estou muito animado(a) para começarmos!`;
        const whatsappUrl = `https://wa.me/${contract.institution.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }

      fetchContracts();
    }
  };


  const getStatusInfo = (status) => {
    switch (status) {
      case 'Ativo':
        return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, variant: 'default' };
      case 'Pendente':
        return { icon: <Clock className="w-4 h-4 text-yellow-500" />, variant: 'secondary' };
      case 'Recusado':
        return { icon: <XCircle className="w-4 h-4 text-red-500" />, variant: 'destructive' };
      default:
        return { icon: <FileText className="w-4 h-4" />, variant: 'outline' };
    }
  };

  return (
    <>
      <Helmet>
        <title>Meus Contratos - GO! HIRE</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-8">Meus Contratos</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Contratos</CardTitle>
            <CardDescription>Visualize e gerencie todos os seus contratos.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || authLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : contracts.length > 0 ? (
              <div className="space-y-4">
                {contracts.map((contract) => {
                  const { icon, variant } = getStatusInfo(contract.status);
                  const otherParty = profile.role === 'professor' ? contract.institution.full_name : contract.professor.full_name;
                  const otherPartyRole = profile.role === 'professor' ? 'Instituição' : 'Professor';
                  
                  return (
                    <motion.div
                      key={contract.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-4 flex flex-col justify-between items-start gap-4"
                    >
                      <div className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground">{contract.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {otherPartyRole}: <span className="font-medium text-foreground">{otherParty}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Criado em: {new Date(contract.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              {icon}
                              <Badge variant={variant}>{contract.status}</Badge>
                            </div>
                            {profile?.role === 'professor' && contract.status === 'Pendente' && (
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <Button size="sm" onClick={() => handleUpdateStatus(contract.id, 'Ativo', contract)}>
                                  <Check className="w-4 h-4 mr-2" /> Aceitar
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(contract.id, 'Recusado', contract)}>
                                  <X className="w-4 h-4 mr-2" /> Recusar
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <Chat contractId={contract.id} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhum contrato encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quando você tiver contratos, eles aparecerão aqui.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ContractsPage;