import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Code, Database, Server, Wind } from 'lucide-react';

const techStack = [
    { name: 'Vite', icon: <Code className="w-8 h-8 text-primary"/>, description: 'Build tool e servidor de desenvolvimento ágil.' },
    { name: 'React', icon: <Code className="w-8 h-8 text-primary"/>, description: 'Biblioteca para construir interfaces de usuário.' },
    { name: 'TailwindCSS', icon: <Wind className="w-8 h-8 text-primary"/>, description: 'Framework CSS para estilização rápida e moderna.' },
    { name: 'Supabase', icon: <Database className="w-8 h-8 text-primary"/>, description: 'Backend como serviço para banco de dados e autenticação.' },
    { name: 'Framer Motion', icon: <Server className="w-8 h-8 text-primary"/>, description: 'Biblioteca de animação para uma experiência fluida.' },
]

const ArchitecturePage = () => {
    return (
        <>
            <Helmet>
                <title>Arquitetura - GO! HIRE</title>
                <meta name="description" content="Conheça a arquitetura e as tecnologias por trás da plataforma GO! HIRE." />
            </Helmet>
            <div className="bg-background">
                <div className="pt-32 pb-16 px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Arquitetura da Plataforma</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Construída com tecnologias modernas para ser rápida, segura e escalável.
                        </p>
                    </motion.div>
                </div>

                <div className="max-w-4xl mx-auto px-4 pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-card p-8 rounded-xl border border-border"
                    >
                        <h2 className="text-2xl font-bold text-foreground mb-6">Tecnologias Utilizadas</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {techStack.map(tech => (
                                <div key={tech.name} className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                      {tech.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-foreground">{tech.name}</h3>
                                        <p className="text-muted-foreground">{tech.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ArchitecturePage;