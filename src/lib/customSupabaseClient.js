import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kswriyoenvggopxiztoh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3JpeW9lbnZnZ29weGl6dG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDM1OTMsImV4cCI6MjA3ODAxOTU5M30.9TX2xS9DWl8zRgsz_SIpea1V9H167BN3lSu2W9m6vk4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);