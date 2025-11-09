import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LifeBuoy, Send, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SupportPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar os tickets.' });
    } else {
      setTickets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Assunto e mensagem são obrigatórios.' });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('support_tickets').insert([
        { user_id: user.id, subject, message, status: 'Aberto' }
    ]);
    setIsSubmitting(false);

    if(error) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível enviar o ticket." });
    } else {
        toast({ title: "Sucesso!", description: "Ticket de suporte enviado." });
        await fetchTickets();
        setSubject('');
        setMessage('');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Aberto': return 'default';
      case 'Em Andamento': return 'secondary';
      case 'Resolvido': return 'success';
      default: return 'outline';
    }
  };


  return (
    <>
      <Helmet>
        <title>Suporte - GO! HIRE</title>
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Central de Suporte</h1>
        <p className="text-muted-foreground mb-8">Precisa de ajuda? Entre em contato ou veja seus tickets.</p>
        
        <div className="grid gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LifeBuoy />Abrir Novo Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium mb-1">Assunto</label>
                            <input id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border rounded"/>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-1">Mensagem</label>
                            <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Descreva seu problema ou dúvida em detalhes..."/>
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                            Enviar Ticket
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><MessageSquare />Seus Tickets</h2>
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : tickets.length > 0 ? (
                    tickets.map(ticket => (
                        <Card key={ticket.id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <span>{ticket.subject}</span>
                                    <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                                </CardTitle>
                                <CardDescription>Criado em: {new Date(ticket.created_at).toLocaleString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{ticket.message}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground p-8 text-center border-2 border-dashed rounded-lg">Você ainda não abriu nenhum ticket.</p>
                )}
            </div>
        </div>
      </motion.div>
    </>
  );
};

export default SupportPage;