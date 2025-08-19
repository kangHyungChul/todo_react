// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 전용 Supabase 객체 (CSR/SSR에서 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);