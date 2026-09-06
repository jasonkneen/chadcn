import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createCatalogTools,registerCatalogTools} from '../src/webmcp.mjs';
const demos=[{id:'one:button',title:'Button',source:'one',kind:'Component',family:'button'},{id:'two:button',title:'Button',source:'two',kind:'Component',family:'button'}];
test('catalog tools retain provider variants and reject unknown navigation',async()=>{
 let opened;const tools=createCatalogTools(demos,d=>opened=d.id);
 assert.equal((await tools[0].execute({query:'button'})).total,2);
 assert.equal((await tools[0].execute({source:'two'})).items[0].id,'two:button');
 assert.equal((await tools[1].execute({id:'one:button'})).variants.length,2);
 await assert.rejects(tools[2].execute({id:'https://evil.example'}),/Unknown demo/);
 assert.equal(opened,undefined);
 await tools[2].execute({id:'two:button'});assert.equal(opened,'two:button');
 await assert.rejects(tools[0].execute({offset:-1}),/Invalid/);
});
test('registration aborts its tools on disposal and cleans partial failure',async()=>{
 const signals=[];const dispose=await registerCatalogTools({registerTool:async(_,options)=>signals.push(options.signal)},createCatalogTools(demos,()=>{}));
 assert.equal(signals.length,3);assert.equal(signals[0].aborted,false);dispose();assert.ok(signals.every(s=>s.aborted));
 let signal;await assert.rejects(registerCatalogTools({registerTool:async(_,options)=>{signal=options.signal;throw Error('rejected')}},createCatalogTools(demos,()=>{})),/rejected/);assert.equal(signal.aborted,true);
 const unsupported=await registerCatalogTools(undefined,[]);unsupported();
});
