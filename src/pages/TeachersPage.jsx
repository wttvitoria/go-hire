import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const TeachersPage = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "🚧 Em Construção!",
      description: "Esta página será implementada em breve. Você poderá buscar por professores aqui!",
    });
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Professores - GO! HIRE</title>
      </Helmet>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Página de Professores</h1>
          <p className="text-xl text-gray-600">
            Esta seção está sendo preparada. Volte em breve!
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default TeachersPage;