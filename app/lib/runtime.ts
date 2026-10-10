import {database} from './database';
import {storageClient,evidenceBucket} from './supabase/server';
// Retain the workflow interface while replacing D1/R2 with PostgreSQL/Storage.
export const env={get DB(){return database()},get RESEND_API_KEY(){return process.env.RESEND_API_KEY},get RESEND_FROM(){return process.env.RESEND_FROM},get APP_URL(){return process.env.APP_URL},get PRIVATE_SITE_MAINTENANCE(){return process.env.MAINTENANCE_SECRET?'enabled':undefined},BUCKET:{async put(key:string,bytes:ArrayBuffer,options:{httpMetadata:{contentType:string}}){const {error}=await storageClient().storage.from(evidenceBucket).upload(key,bytes,{contentType:options.httpMetadata.contentType,upsert:false});if(error)throw new Error('Evidence storage upload failed');}}};
