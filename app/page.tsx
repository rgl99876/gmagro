import {requireChatGPTUser} from './chatgpt-auth';
import ERP from './erp';
export const dynamic='force-dynamic';
export default async function Page(){const user=await requireChatGPTUser('/');return <ERP name={user.displayName}/>}
