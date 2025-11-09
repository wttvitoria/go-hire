import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Users, Heart, Zap } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-teal-500" />,
      title: 'Nossa Missão',
      description: 'Facilitar a conexão entre instituições de ensino e professores qualificados, otimizando o processo de contratação.'
    },
    {
      icon: <Users className="w-8 h-8 text-teal-500" />,
      title: 'Comunidade Forte',
      description: 'Construir uma comunidade engajada que valoriza a educação e o desenvolvimento profissional contínuo.'
    },
    {
      icon: <Heart className="w-8 h-8 text-teal-500" />,
      title: 'Paixão por Educar',
      description: 'Acreditamos que o professor certo no lugar certo pode transformar o futuro da educação.'
    },
    {
      icon: <Zap className="w-8 h-8 text-teal-500" />,
      title: 'Inovação Constante',
      description: 'Utilizamos tecnologia para criar soluções inteligentes e eficientes para o setor educacional.'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sobre Nós - GO! HIRE</title>
        <meta name="description" content="Conheça a GO! HIRE, a plataforma que está revolucionando a contratação de professores no Brasil." />
      </Helmet>
      
      <div className="bg-gray-50">
        <div className="pt-32 pb-16 px-4 bg-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Revolucionando a Contratação na Educação</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nascemos para simplificar e agilizar a forma como escolas e professores se conectam.
            </p>
          </motion.div>
        </div>

        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-4xl font-bold mb-6 text-gray-800">Nossa História</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  A GO! HIRE surgiu da necessidade de um processo mais transparente e eficiente para a contratação de professores. Observamos as dificuldades enfrentadas por instituições para encontrar talentos e por educadores para achar a vaga ideal.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Com uma equipe apaixonada por tecnologia e educação, desenvolvemos uma plataforma que não apenas lista vagas, mas que gerencia todo o fluxo de contratação, desde a candidatura até a assinatura do contrato.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img alt="Equipe da GO! HIRE colaborando em um escritório moderno" className="rounded-2xl shadow-xl w-full" src="https://images.unsplash.com/photo-1598737129494-69cb30f96a73" />
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-lg text-center"
                >
                  <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center text-white mx-auto mb-5">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;