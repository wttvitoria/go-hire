import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Calendar, MessageSquare } from 'lucide-react';

const integrations = [
  { name: 'Google Agenda', icon: <Calendar className="w-10 h-10 text-blue-500" />, description: 'Sincronize seus contratos e entrevistas.' },
  { name: 'Microsoft Teams', icon: <MessageSquare className="w-10 h-10 text-purple-500" />, description: 'Realize entrevistas diretamente pelo Teams.' },
  { name: 'WhatsApp Bot', icon: <MessageSquare className="w-10 h-10 text-green-500" />, description: 'Receba notificações de vagas e propostas.' },
];

const IntegrationsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-foreground mb-8">Integrações</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card p-6 rounded-xl border border-border shadow-sm text-center"
          >
            <div className="inline-block p-4 bg-secondary rounded-full mb-4">
              {integration.icon}
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{integration.name}</h2>
            <p className="text-muted-foreground mb-4">{integration.description}</p>
            <span className="text-sm font-semibold text-primary">Em Breve</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default IntegrationsPage;