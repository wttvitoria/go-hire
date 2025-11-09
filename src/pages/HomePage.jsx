import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserCheck, FileText, GraduationCap, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const HomePage = () => {
  const { toast } = useToast();
  const { profile, session } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="w-7 h-7 text-primary" />,
      title: 'Busca Inteligente',
      description: 'Filtros avançados para encontrar o professor ou a vaga ideal para suas necessidades.'
    },
    {
      icon: <UserCheck className="w-7 h-7 text-primary" />,
      title: 'Perfis Verificados',
      description: 'Garantimos a qualidade e autenticidade dos perfis, trazendo mais segurança para todos.'
    },
    {
      icon: <FileText className="w-7 h-7 text-primary" />,
      title: 'Contratos Simplificados',
      description: 'Gere e assine contratos digitais diretamente na plataforma, sem burocracia.'
    },
  ];

  const howItWorksInstitution = [
    { step: 1, title: 'Publique sua Vaga', description: 'Descreva a vaga com todos os detalhes importantes.' },
    { step: 2, title: 'Encontre Professores', description: 'Analise perfis qualificados que se candidataram.' },
    { step: 3, title: 'Contrate com Facilidade', description: 'Envie propostas e assine contratos digitalmente.' },
  ];

  const howItWorksProfessor = [
    { step: 1, title: 'Crie seu Perfil', description: 'Destaque sua formação, experiência e habilidades.' },
    { step: 2, title: 'Encontre Vagas', description: 'Busque por oportunidades que combinam com você.' },
    { step: 3, title: 'Seja Contratado', description: 'Receba propostas e inicie sua próxima jornada.' },
  ];

  const handleFindTeachersClick = () => {
    if (session && profile?.role === 'institution') {
      navigate('/dashboard/teachers');
    } else {
      toast({
        title: "Acesso Exclusivo",
        description: "A busca por professores é uma funcionalidade para instituições. Faça login para continuar.",
      });
      navigate('/login');
    }
  };

  return (
    <>
      <Helmet>
        <title>GO! HIRE - O Ponto de Encontro da Educação</title>
        <meta name="description" content="Conectamos instituições de ensino a professores apaixonados. Encontre a vaga perfeita ou o talento ideal para sua equipe." />
      </Helmet>
      
      <div className="bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative pt-20 pb-28 px-4 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-40" 
            style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'\%23e5e7eb\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}
          ></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-5xl font-extrabold mb-5 leading-tight"
            >
              O Ponto de Encontro da <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600">Educação</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base lg:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Conectamos instituições de ensino a professores apaixonados. Encontre a vaga perfeita ou o talento ideal para sua equipe.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button onClick={handleFindTeachersClick} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-5 text-base shadow-lg shadow-primary/30">
                Encontrar Professores
              </Button>
              <Link to="/jobs">
                <Button size="lg" variant="outline" className="px-7 py-5 text-base">
                  Procurar Vagas
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-2 text-foreground">Por que escolher a GO! HIRE?</h2>
              <p className="text-base text-muted-foreground">Tudo que você precisa em uma única plataforma.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="bg-card rounded-xl p-6 text-center border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-2 text-foreground">Como Funciona</h2>
              <p className="text-base text-muted-foreground">Simples, rápido e eficiente.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h3 className="text-xl font-bold mb-6 text-center text-foreground flex items-center justify-center gap-2"><Building className="w-5 h-5" /> Para Instituições</h3>
                <div className="space-y-6">
                  {howItWorksInstitution.map(item => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-full text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h3 className="text-xl font-bold mb-6 text-center text-foreground flex items-center justify-center gap-2"><GraduationCap className="w-5 h-5" /> Para Professores</h3>
                <div className="space-y-6">
                  {howItWorksProfessor.map(item => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-full text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 bg-secondary">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-3 text-foreground">Pronto para começar?</h2>
              <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                Junte-se a milhares de instituições e professores que já estão transformando a educação.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 text-base shadow-lg shadow-primary/30">
                  Crie sua conta gratuitamente
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;