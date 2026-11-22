import {createWorker} from '../src/index.js';
import {context,isUnsafe,localReply} from '../../v3-preview/assets/conversation.mjs';
import catalog from '../../v3-preview/assets/catalog.json' with {type:'json'};

const core=createWorker();
const ORIGIN='https://oilgaterealty.github.io';
const MAX=8192;
export async function prepare(request){
 const reader=request.body?.getReader(); if(!reader)return null;
 let size=0;const dec=new TextDecoder();let raw='';
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX){await reader.cancel();return null;}raw+=dec.decode(value,{stream:true});}
 raw+=dec.decode();
 let b; try{b=JSON.parse(raw);}catch{return null;}
 if(!b||typeof b.message!=='string'||b.message.length>400||isUnsafe(b.message))return null;
 const prior=(Array.isArray(b.history)?b.history:[]).slice(-10).filter(t=>t&&t.role==='user'&&typeof t.text==='string'&&t.text.length<=400&&!isUnsafe(t.text));
 const propertyId=context(b.message,prior)||b.propertyId;
 if(!Object.hasOwn(catalog,propertyId))return null;
 // History can resolve the property, but cannot supply or override facts, dates, or a checkout.
 return {propertyId,session:b.session,message:b.message};
}
export default {async fetch(request,env){
 const origin=request.headers.get('origin');
 if(origin!==ORIGIN||new URL(request.url).pathname!=='/chat'||request.method!=='POST')return core.fetch(request,env);
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':ORIGIN,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',Vary:'Origin'};
 if(!(request.headers.get('content-type')||'').startsWith('application/json'))return new Response('{}',{status:415,headers});
 const b=await prepare(request);
 if(!b)return new Response(JSON.stringify({reply:'Ask about a rental without sharing personal or payment information.'}),{status:400,headers});
 const inner=await core.fetch(new Request(request.url,{method:'POST',headers:request.headers,body:JSON.stringify(b)}),env);
 if(!inner.ok)return inner;
 const status=await inner.json();
 // The live classifier is reused, not its old Parkgate facts. The preview never renders generated text or upstream pricing.
 const reply=({checkin:()=>localReply('check-in',[],catalog,b.propertyId), amenities:()=>localReply('amenities',[],catalog,b.propertyId), parking:()=>localReply('parking',[],catalog,b.propertyId), pets:()=>localReply('pets',[],catalog,b.propertyId), price:()=>localReply('price',[],catalog,b.propertyId), availability:()=>localReply('availability',[],catalog,b.propertyId), rules:()=> 'Booking guests must be 18 or older. Read the rules and terms before confirming.',contact:()=> 'Email Oilgate Realty using the footer, or use Proceed for secure checkout.'})[status.intent];
 const deterministic=localReply(b.message,[],catalog,b.propertyId);
 const text=/bed|bath|sleep|guest|capacity/i.test(b.message)?deterministic:(reply?.()||deterministic);
 return new Response(JSON.stringify({reply:text}),{status:200,headers});
}};
