// Compatibility names for existing workflow; identity now comes only from Supabase.
import {redirect} from 'next/navigation';
import {authClient} from './lib/supabase/server';
export type ChatGPTUser={userId:string;displayName:string;email:string;fullName:string|null};
export async function getChatGPTUser():Promise<ChatGPTUser|null>{const {data:{user},error}=await (await authClient()).auth.getUser();if(error||!user?.email||!user.email_confirmed_at)return null;return {userId:user.id,email:user.email,displayName:user.user_metadata?.full_name||user.email,fullName:user.user_metadata?.full_name||null};}
export async function requireChatGPTUser(_returnTo:string){const user=await getChatGPTUser();if(!user)redirect('/login');return user;}
