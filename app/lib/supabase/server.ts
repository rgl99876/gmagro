import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
export async function authClient(){
 const store=await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{
  cookies:{getAll:()=>store.getAll(),setAll:(entries)=>{try{entries.forEach(({name,value,options})=>store.set(name,value,options));}catch{/* Server Components cannot write cookies; proxy refreshes them. */}}}
 });
}
export function storageClient(){if(!process.env.SUPABASE_SERVICE_ROLE_KEY)throw new Error('Supabase storage is not configured');return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});}
export const evidenceBucket='erp-evidence';
