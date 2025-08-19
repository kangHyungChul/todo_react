// lib/supabase/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 클라이언트 전용 Supabase 객체 (CSR/SSR에서 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 관리자 클라이언트 (서버사이드)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
