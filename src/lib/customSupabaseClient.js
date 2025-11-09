// src/lib/customSupabaseClient.js
import { createClient } from '@supabase/supabase-js'

// ⚠️ As variáveis de ambiente vêm do Netlify (.env no build)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificação de segurança
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
