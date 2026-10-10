export const roles=['Sales Officer','Sales Manager','Regional Sales Manager','Accounts Manager','CEO','Production','Quality Manager','MD'];
export const stages=['Sales Manager','Regional Sales Manager','Accounts Manager','CEO','Production','Scheduled','Completed'];
export const complaintStages=['Reported','Triage','Investigating','Corrective action','Resolved','Closed'];
export const products=[
['Gemsip Mango',200,30],['Gemsip Mango',625,24],['Gem Jeera Masala',200,30],['Gem Soda',300,24],['Gem Lemondew',200,30],['Gemsip Mango Premium',200,30],['Gem Misty Lemon',200,30],['Gem Orange',200,30],['Gemsip Guava',200,30],['Gem Power',160,30],['Gemsip Mango',300,24],['Gem Jeera Masala',300,24],['Gem Orange',300,24],['Gem Lemondew',300,24],['Gem Misty Lemon',300,24],['Gem Orange',600,20],['Gemsip Apple',200,30],['Gem Soda',600,20],['Gem Jeera Masala',600,20],['Gem Jeera Masala',2000,9],['Gemsip Mango Aseptic',150,30],['Gem Cola',200,30],['Gem Frooz Apple Fizzy',160,30],['Gem Lemondew',600,20]
].map((p,i)=>({id:'GM'+String(i+1).padStart(3,'0'),name:p[0] as string,ml:p[1] as number,pack:p[2] as number,label:`${p[0]} ${p[1]===2000?'2ltr':p[1]+'ml'} (1×${p[2]})`}));
export const total=(lines:any[])=>lines.reduce((a,l)=>a+Math.round(l.cases*l.price*(1-(l.discount||0)/100)*(1+(l.tax||0)/100)*100),0)/100;

export const allZoneRoles=['Regional Sales Manager','Accounts Manager','CEO','MD','Production','Quality Manager','Administrator'];
export const normalizeRole=(role:string)=>({'Regional Sales Head':'Regional Sales Manager','Accounts User':'Accounts Manager','Managing Director':'MD'} as Record<string,string>)[role]||role;
export function memberTerritories(m:any):string[]{if(allZoneRoles.includes(normalizeRole(m.role)))return ['All'];if(Array.isArray(m.territories))return m.territories;try{const a=JSON.parse(m.region);if(Array.isArray(a))return a.filter((v:any)=>typeof v==='string')}catch{}return m.region?[m.region]:[]}
export const normalizeMember=(m:any)=>({...m,role:normalizeRole(m.role),region:allZoneRoles.includes(normalizeRole(m.role))?'All':m.region,territories:memberTerritories(m)});
export const canAccessRecord=(m:any,r:any)=>m.role==='Administrator'||(m.role==='Sales Officer'?r.owner===m.email:m.role!=='Sales Manager'||memberTerritories(m).includes(r.region));

