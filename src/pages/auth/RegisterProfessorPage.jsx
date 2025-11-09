import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const educationLevels = [
  { value: 'educacao_infantil', label: 'Educação Infantil' },
  { value: 'fundamental_i', label: 'Fundamental I' },
  { value: 'fundamental_ii', label: 'Fundamental II' },
  { value: 'medio', label: 'Ensino Médio' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'superior', label: 'Superior' },
];

const contractTypes = [
  { value: 'temporario', label: 'Temporário' },
  { value: 'substituicao', label: 'Substituição' },
  { value: 'tempo_parcial', label: 'Tempo Parcial' },
  { value: 'integral', label: 'Integral' },
  { value: 'freelancer', label: 'Freelancer' },
];

export default function RegisterProfessorPage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    city_state: '',
    subjects: '',
    education_level: '',
    contract_type: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Evita setState após unmount
  useEffect(() => {
    let alive = true;

    const loadProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data && alive) {
          setForm((prev) => ({
            ...prev,
            full_name: data.full_name || '',
            phone: data.phone || '',
            city_state: data.city_state || '',
            subjects: data.subjects || '',
            education_level: data.education_level || '',
            contract_type: data.contract_type || '',
            bio: data.bio || '',
          }));
        }
      } catch (err) {
        if (alive) setFeedback({ type: 'error', message: 'Falha ao carregar seu perfil.' });
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadProfile();
    return () => { alive = false; };
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    // Nunca setar undefined em selects / inputs
    setForm((prev) => ({ ...prev, [name]: value ?? '' }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    // validações mínimas
    if (!form.full_name.trim()) {
      setFeedback({ type: 'error', message: 'Informe seu nome completo.' });
      return;
    }
    if (!form.education_level) {
      setFeedback({ type: 'error', message: 'Selecione o nível de ensino.' });
      return;
    }
    if (!form.contract_type) {
      setFeedback({ type: 'error', message: 'Selecione o tipo de contrato.' });
      return;
    }

    try {
      setSaving(true);
      setFeedback({ type: '', message: '' });

      // upsert no profiles (id é o mesmo de auth.users)
      const payload = {
        id: user.id,
        full_name: form.full_name,
        phone: form.phone,
        city_state: form.city_state,
        subjects: form.subjects,
        education_level: form.education_level,
        contract_type: form.contract_type,
        bio: form.bio,
      };

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) throw error;

      setFeedback({ type: 'success', message: 'Perfil salvo com sucesso!' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Não foi possível salvar seu perfil.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de Professor • GO! HIRE</title>
      </Helmet>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Cadastro de Professor</h1>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center min-h-[40vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              className="space-y-5 bg-white/70 rounded-md border p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Feedback */}
              <AnimatePresence>
                {feedback.message && (
                  <motion.div
                    key={feedback.message + feedback.type}
                    className={`rounded-md p-3 text-sm ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    {feedback.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome completo</label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={onChange}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Ex.: Ana Souza"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Telefone (WhatsApp)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cidade/UF</label>
                  <input
                    type="text"
                    name="city_state"
                    value={form.city_state}
                    onChange={onChange}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Ex.: Recife/PE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Disciplinas</label>
                  <input
                    type="text"
                    name="subjects"
                    value={form.subjects}
                    onChange={onChange}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Ex.: Matemática, Física"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nível de ensino</label>
                  {/* Select SEM motion e controlado */}
                  <select
                    name="education_level"
                    value={form.education_level}
                    onChange={onChange}
                    className="w-full rounded-md border px-3 py-2 bg-white"
                  >
                    <option value="">Selecione…</option>
                    {educationLevels.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de contrato</label>
                  <select
                    name="contract_type"
                    value={form.contract_type}
                    onChange={onChange}
                    className="w-full rounded-md border px-3 py-2 bg-white"
                  >
                    <option value="">Selecione…</option>
                    {contractTypes.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sobre você (bio)</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  rows={5}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Conte brevemente sua experiência, certificações e preferências de trabalho."
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar perfil
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
