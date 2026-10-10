import { Pool, type PoolClient } from 'pg';
export type Queryable={query:(sql:string,values?:any[])=>Promise<any>};
// Only trusted application SQL reaches this adapter. No browser-supplied SQL.
export function postgresSQL(sql:string){
 sql=sql.replace(/json_extract\(data,'\$\.([A-Za-z_]+)'\)/g,"(data::jsonb->>'$1')");
 const ignore=/^INSERT OR IGNORE /i.test(sql);if(ignore)sql=sql.replace(/^INSERT OR IGNORE /i,'INSERT ');
 let quoted=false,index=0,out='';for(let i=0;i<sql.length;i++){const c=sql[i];if(c==="'"){out+=c;if(quoted&&sql[i+1]==="'"){out+=sql[++i];continue;}quoted=!quoted;}else out+=c==='?'&&!quoted?'$'+(++index):c;}
 return out+(ignore?' ON CONFLICT DO NOTHING':'');
}
class Statement{
 values:any[]=[];constructor(public db:Database,public sql:string){}bind(...values:any[]){this.values=values;return this;}
 async execute(connection:Queryable=this.db.connection){const r=await connection.query(postgresSQL(this.sql),this.values);return {results:r.rows??[],meta:{changes:r.rowCount??r.affectedRows??0}};}
 run(){return this.execute()}all(){return this.execute()}async first(){return (await this.execute()).results[0]??null;}
}
export class Database{
 constructor(public connection:Queryable,private checkout?:()=>Promise<PoolClient>){}
 prepare(sql:string){return new Statement(this,sql)}
 async batch(statements:Statement[]){const client=this.checkout?await this.checkout():this.connection;try{await client.query('BEGIN');const results=[];for(const s of statements)results.push(await s.execute(client));await client.query('COMMIT');return results;}catch(error){await client.query('ROLLBACK');throw error;}finally{if(this.checkout)(client as PoolClient).release();}}
}
const globalDB=globalThis as typeof globalThis&{erpPool?:Pool};
export function database(){if(!process.env.DATABASE_URL)throw new Error('Supabase database connection is not configured');const pool=globalDB.erpPool??=new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:10000,idleTimeoutMillis:10000});return new Database(pool,()=>pool.connect());}
