import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ReviewsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-foreground mb-8">Avaliações</h1>
            <div className="bg-card p-8 rounded-xl border border-border shadow-sm text-center">
                <Star className="w-16 h-16 mx-auto text-primary mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Página em Construção</h2>
                <p className="text-muted-foreground">Em breve, você poderá ver e gerenciar as avaliações recebidas aqui.</p>
            </div>
        </motion.div>
    );
};

export default ReviewsPage;