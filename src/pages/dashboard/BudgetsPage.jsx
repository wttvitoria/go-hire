import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BudgetsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newBudget, setNewBudget] = useState({
    total_cost: '',
    accommodation_cost: '',
    food_cost: '',
    transport_cost: '',
    details: { title: '' },
  });

  const fetchBudgets = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar os orçamentos.' });
    } else {
      setBudgets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'title') {
      setNewBudget(prev => ({ ...prev, details: { title: value } }));
    } else {
      setNewBudget(prev => ({ ...prev, [id]: value ? parseFloat(value) : '' }));
    }
  };

  const handleCreateBudget = async () => {
    if (!newBudget.details.title || !newBudget.total_cost) {
        toast({ variant: "destructive", title: "Erro", description: "Título e Custo Total são obrigatórios." });
        return;
    }
    
    const { error } = await supabase.from('budgets').insert([
        { 
            user_id: user.id,
            ...newBudget,
            accommodation_cost: newBudget.accommodation_cost || null,
            food_cost: newBudget.food_cost || null,
            transport_cost: newBudget.transport_cost || null,
        }
    ]);

    if(error) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível criar o orçamento." });
    } else {
        toast({ title: "Sucesso!", description: "Orçamento criado." });
        await fetchBudgets();
        setIsDialogOpen(false);
        setNewBudget({ total_cost: '', accommodation_cost: '', food_cost: '', transport_cost: '', details: { title: '' } });
    }
  };
  
  const handleDeleteBudget = async (id) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if(error) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível deletar o orçamento." });
    } else {
        toast({ title: "Sucesso!", description: "Orçamento deletado." });
        fetchBudgets();
    }
  };

  return (
    <>
      <Helmet>
        <title>Orçamentos - GO! HIRE</title>
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Orçamentos</h1>
            <p className="text-muted-foreground">Crie e gerencie seus orçamentos de contratação.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Orçamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div>
                    <Label htmlFor="title">Título do Orçamento</Label>
                    <input id="title" value={newBudget.details.title} onChange={handleInputChange} className="w-full p-2 border rounded"/>
                </div>
                <div>
                    <Label htmlFor="total_cost">Custo Total (R$)</Label>
                    <input id="total_cost" type="number" value={newBudget.total_cost} onChange={handleInputChange} className="w-full p-2 border rounded"/>
                </div>
                 <div>
                    <Label htmlFor="accommodation_cost">Custo de Acomodação (R$)</Label>
                    <input id="accommodation_cost" type="number" value={newBudget.accommodation_cost} onChange={handleInputChange} className="w-full p-2 border rounded"/>
                </div>
                 <div>
                    <Label htmlFor="food_cost">Custo de Alimentação (R$)</Label>
                    <input id="food_cost" type="number" value={newBudget.food_cost} onChange={handleInputChange} className="w-full p-2 border rounded"/>
                </div>
                 <div>
                    <Label htmlFor="transport_cost">Custo de Transporte (R$)</Label>
                    <input id="transport_cost" type="number" value={newBudget.transport_cost} onChange={handleInputChange} className="w-full p-2 border rounded"/>
                </div>
                 <Button onClick={handleCreateBudget} className="w-full">Criar Orçamento</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : budgets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map(budget => (
                <Card key={budget.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                            <span>{budget.details?.title}</span>
                             <Button variant="ghost" size="icon" onClick={() => handleDeleteBudget(budget.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                             </Button>
                        </CardTitle>
                        <CardDescription>Criado em: {new Date(budget.created_at).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-2xl font-bold text-primary mb-4">R$ {budget.total_cost.toFixed(2)}</p>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            {budget.accommodation_cost && <p>Acomodação: R$ {budget.accommodation_cost.toFixed(2)}</p>}
                            {budget.food_cost && <p>Alimentação: R$ {budget.food_cost.toFixed(2)}</p>}
                            {budget.transport_cost && <p>Transporte: R$ {budget.transport_cost.toFixed(2)}</p>}
                        </div>
                    </CardContent>
                </Card>
            ))}
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Nenhum orçamento encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">Comece criando seu primeiro orçamento.</p>
            </div>
        )}
      </motion.div>
    </>
  );
};

export default BudgetsPage;