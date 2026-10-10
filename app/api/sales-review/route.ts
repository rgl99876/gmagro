import {readFile} from 'node:fs/promises';
import {getChatGPTUser} from '../../chatgpt-auth';
import {env} from '../../lib/runtime';
import {normalizeRole} from '../../catalog';
export const dynamic='force-dynamic';
export async function GET(){const user=await getChatGPTUser();if(!user)return new Response('Sign in required',{status:401});const member:any=await env.DB.prepare('SELECT role FROM members WHERE email=?').bind(user.email.toLowerCase()).first();if(!member||!['Administrator','CEO','MD','Regional Sales Manager','Accounts Manager'].includes(normalizeRole(member.role)))return new Response('The full sales review is available to all-zone management only.',{status:403});return new Response(await readFile(process.cwd()+'/data/sales-review.html','utf8'),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','Content-Security-Policy':"frame-ancestors 'self'"}});}
