import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {isUnsafe, localReply} from '../v3-preview/assets/conversation.mjs';
import {prepare} from '../worker/preview/index.js';
const data = JSON.parse(await readFile(new URL('../v3-preview/assets/catalog.json', import.meta.url)));
test('the preview concierge remembers the named rental for a follow-up',async()=>{
 const previous=[{role:'user',text:'Tell me about Parkgate.'},{role:'assistant',text:'Parkgate has three bedrooms.'}];
 assert.match(localReply('And what beds are there?',previous,data,'603326'),/Parkgate: 3 bedrooms.*2 Queen beds · 1 Full bed/);
 const pre=await prepare(new Request('https://pepper-chat-preview.example/chat',{method:'POST',body:JSON.stringify({message:'And what beds are there?',propertyId:'603326',history:previous})}));
 assert.equal(pre.propertyId,'728474');
 assert.equal(pre.message,'And what beds are there?');
});
test('the preview does not store or answer private payment material or guess a price',()=>{
 assert.equal(isUnsafe('4111 1111 1111 1111'),true);
 assert.match(localReply('What will it cost?',[],data,'603326'),/use Proceed/);
});
test('all six preview pages avoid forbidden public copy',async()=>{
 for(const name of ['index.html','unit-1-at-oilgate-at-oakdale.html','unit-2-at-oilgate-at-oakdale.html','oilgate-at-parkgate.html','direct/index.html','404.html']){
   const html=await readFile(new URL('../v3-preview/'+name,import.meta.url),'utf8');
   assert.match(html,/Akron, Ohio/);
   assert.match(html,/Guests 18\+/);
   assert.doesNotMatch(html,/lodgify|tel:|call your host|suspended|not entered|prices not|\bwhole\b/i);
 }
});
