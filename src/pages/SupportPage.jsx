import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Send, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const SupportPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const fetchTickets = useCallback(async () => {
    if (!user) return;
    setLoadingTickets(true);
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao buscar tickets', description: error.message });
    } else {
      setTickets(data);
    }
    setLoadingTickets(false);
  }, [user, toast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast({ variant: 'destructive', title: 'Campos obrigatórios', description: 'Preencha assunto e mensagem.' });
      return;
    }
    if (!user) {
      toast({ variant: 'destructive', title: 'Ação não permitida', description: 'Você precisa estar logado para enviar um ticket.' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('support_tickets').insert({
      user_id: user.id,
      subject,
      message,
      status: 'Aberto'
    });
    
    setIsSubmitting(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao enviar ticket', description: error.message });
    } else {
      toast({ title: "Ticket de Suporte Enviado!", description: "Nossa equipe entrará em contato em breve." });
      setSubject('');
      setMessage('');
      fetchTickets(); // Refresh the list
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Aberto': return 'bg-blue-100 text-blue-800';
      case 'Em Andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Fechado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <h1 className="text-4xl font-extrabold text-foreground mb-8 text-center">Central de Suporte</h1>
      
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
              <LifeBuoy className="w-7 h-7 text-primary" /> Abrir Novo Ticket
            </h2>
            <p className="text-muted-foreground mb-6">Precisa de ajuda? Descreva seu problema abaixo.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="subject" className="font-semibold">Assunto</Label>
                <input
                  id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required
                  placeholder="Ex: Dúvida sobre contrato"
                  className="w-full mt-2 p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>
              <div>
                <Label htmlFor="message" className="font-semibold">Mensagem</Label>
                <textarea
                  id="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows="6"
                  placeholder="Descreva seu problema ou dúvida em detalhes aqui..."
                  className="w-full mt-2 p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                ></textarea>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-base">
                {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-card p-8 rounded-xl border border-border shadow-lg h-full">
                <h2 className="text-2xl font-bold text-foreground mb-6">Meus Tickets</h2>
                {loadingTickets ? <div className="flex justify-center pt-10"><Loader2 className="w-8 h-8 animate-spin"/></div> : 
                tickets.length > 0 ? (
                    <ul className="space-y-4">
                        {tickets.map(ticket => (
                            <li key={ticket.id} className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold truncate pr-4">{ticket.subject}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(ticket.created_at).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center pt-10">
                        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4"/>
                        <p className="text-muted-foreground">Você não tem tickets abertos.</p>
                    </div>
                )}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupportPage;