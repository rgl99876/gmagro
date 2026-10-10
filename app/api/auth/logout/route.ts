import {authClient} from '../../../lib/supabase/server';
export async function POST(req:Request){if(req.headers.get('origin')!==new URL(req.url).origin)return new Response('Forbidden',{status:403});await (await authClient()).auth.signOut();return Response.json({ok:true});}
