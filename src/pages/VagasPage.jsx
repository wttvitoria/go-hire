import { useState } from 'react'
import { supabase } from '@/lib/customSupabaseClient' // ou seu caminho
import { useAuth } from '@/contexts/AuthContext'      // se você tiver

const EDUCATION_LEVELS = ['Infantil','Fundamental','Médio','Técnico','Superior']
const CONTRACT_TYPES   = ['Temporário','Substituição','Integral','Parcial','Horista']

export default function NovaVaga() {
  const { user } = useAuth?.() || { user: null } // não quebra se não houver contexto
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [educationLevel, setEducationLevel] = useState('') // NUNCA undefined
  const [contractType, setContractType] = useState('')     // NUNCA undefined
  const [city, setCity] = useState('')
  const [salary, setSalary] = useState('')                 // string vazia é ok
  const [msg, setMsg] = useState(null)

  const onChangeEducation = (e) => {
    // nada de JSON.parse / objetos complexos
    setEducationLevel(e.target.value || '')
  }

  const onChangeContract = (e) => {
    setContractType(e.target.value || '')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg(null)

    // Validação mínima no front para evitar payload inválido
    if (!title || !educationLevel || !contractType) {
      setMsg('Preencha título, nível e tipo de contrato.')
      return
    }

    // Se ainda não quer chamar o Supabase, comente o insert e só teste o form:
    // setMsg('Form ok! (sem enviar ao banco)'); return;

    // Se for enviar:
    try {
      const institutionId = user?.id || null // evite undefined
      const payload = {
        title,
        description,
        education_level: educationLevel,
        contract_type: contractType,
        city,
        salary: salary === '' ? null : Number(salary),
        institution_id: institutionId
      }
      console.log('payload:', payload)

      const { error } = await supabase.from('jobs').insert(payload).select('id').single()
      if (error) throw error
      setMsg('✅ Vaga criada com sucesso!')
    } catch (err) {
      console.error(err)
      setMsg(`Erro ao salvar: ${err.message || err}`)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" />

      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descrição" />

      <select value={educationLevel} onChange={onChangeEducation}>
        <option value="">Nível de ensino</option>
        {EDUCATION_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>

      <select value={contractType} onChange={onChangeContract}>
        <option value="">Tipo de contrato</option>
        {CONTRACT_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>

      <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Cidade" />
      <input value={salary} onChange={e=>setSalary(e.target.value)} placeholder="Salário (opcional)" />

      <button type="submit">Publicar vaga</button>
      {msg && <p>{msg}</p>}
    </form>
  )
}
