import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardHover = {
  scale: 1.03,
  boxShadow: '0 10px 25px -5px rgba(0, 128, 128, 0.1), 0 8px 10px -6px rgba(0, 128, 128, 0.1)',
  transition: { type: 'spring', stiffness: 300, damping: 15 }
};

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Junte-se à GO! HIRE</title>
      </Helmet>
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'\%23e5e7eb\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl text-center"
        >
          <Link to="/" className="flex items-center justify-center gap-2 group mb-8">
            <ArrowUpDown className="w-10 h-10 text-primary" />
            <span className="text-4xl font-bold text-foreground">GO! HIRE</span>
          </Link>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Junte-se à GO! HIRE</motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Escolha o tipo de perfil que melhor descreve você e comece sua jornada.
          </motion.p>
          
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Link to="/cadastro/professor" className="text-left">
              <motion.div 
                whileHover={cardHover}
                whileTap={{ scale: 0.98 }}
                className="p-8 bg-card border rounded-xl cursor-pointer shadow-lg h-full flex flex-col"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Sou Professor</h2>
                <p className="text-muted-foreground mb-6 flex-grow">Crie seu perfil, mostre suas habilidades e encontre as melhores vagas.</p>
                <motion.div whileHover={{y: -2}} whileTap={{scale: 0.99}}>
                  <Button className="w-full bg-primary hover:bg-primary/90">Cadastrar como Professor</Button>
                </motion.div>
              </motion.div>
            </Link>

            <Link to="/cadastro/instituicao" className="text-left">
              <motion.div 
                whileHover={cardHover}
                whileTap={{ scale: 0.98 }}
                className="p-8 bg-card border rounded-xl cursor-pointer shadow-lg h-full flex flex-col"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Sou Instituição</h2>
                <p className="text-muted-foreground mb-6 flex-grow">Publique vagas, encontre talentos qualificados e gerencie contratações.</p>
                 <motion.div whileHover={{y: -2}} whileTap={{scale: 0.99}}>
                  <Button className="w-full bg-primary hover:bg-primary/90">Cadastrar como Instituição</Button>
                 </motion.div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-muted-foreground">
              Já possui uma conta?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;