import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const local=JSON.parse(fs.readFileSync('sources.json')).sources.map(source=>{
 const git=args=>{try{return execFileSync('git',['-C',source.path,...args],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim()}catch{return ''}};
 const first=git(['rev-list','--max-parents=0','HEAD']).split('\n')[0];
 const firstFields=first?git(['show','-s','--format=%aI%x09%an%x09%s',first]).split('\t'):[];
 let pkg={};try{pkg=JSON.parse(fs.readFileSync(source.path+'/package.json'))}catch{}
 let license=pkg.license??null;
 for(const file of ['LICENSE','LICENSE.md','LICENSE.txt']){try{const text=fs.readFileSync(source.path+'/'+file,'utf8');if(text.includes('MIT License'))license='MIT';else if(text.includes('Apache License'))license='Apache-2.0';break}catch{}}
 return {...source,packageAuthor:pkg.author??null,license,localCommit:git(['rev-parse','HEAD']),firstCommit:firstFields.length?{sha:first,date:firstFields[0],author:firstFields[1],title:firstFields[2]}:null};
});
const remote=JSON.parse(fs.readFileSync('data/library-remote.json'));
const catalog=JSON.parse(fs.readFileSync('data/catalog.json')).items;
local.push({id:'shadcn-directory',repository:'https://github.com/shadcn-ui/ui',homepage:'https://ui.shadcn.com/docs/directory',kind:'directory'}, {id:'awesome-shadcn-ui',repository:'https://github.com/birobirobiro/awesome-shadcn-ui',homepage:'https://awesomeshadcn.dev',kind:'directory'});
const profiles=local.map(source=>{
 const repo=source.repository.replace('https://github.com/','');const r=remote.repositories.find(r=>r.repo===repo);const upstream=source.id.startsWith('shadcn-')&&source.id!=='shadcn-cssinjs'?'shadcn':source.id;
 const items=catalog.filter(i=>i.source===source.id);
 return {id:source.id,name:source.variant?`shadcn / ${source.variant}`:source.id,description:(r?.description??'').replace(/\p{Extended_Pictographic}/gu,''),variant:source.variant??null,repository:source.repository,homepage:r?.homepage??source.homepage,documentation:source.homepage,screenshot:`/library-screenshots/${upstream}.jpg`,screenshotAt:remote.fetchedAt,owner:r?.metadata.owner.login??repo.split('/')[0],ownerAvatar:r?.metadata.owner.avatar_url??null,createdAt:r?.createdAt??null,creator:typeof source.packageAuthor==='string'?source.packageAuthor:source.packageAuthor?.name??null,firstCommit:source.firstCommit??null,license:r?.license&&r.license!=='NOASSERTION'?r.license:source.license??null,stars:r?.stars??null,forks:r?.forks??null,issues:r?.issues??null,language:r?.language??null,topics:r?.topics??[],archived:r?.archived??false,defaultBranch:r?.metadata.default_branch??null,framework:source.framework??'react',kind:source.kind,itemCount:items.length,packagedCount:items.filter(i=>i.status==='packaged').length,localCommit:source.localCommit??null,commits:(r?.commits??[]).map(c=>({sha:c.sha,title:c.message.split('\n')[0],date:c.created_at,url:c.html_url})),fetchedAt:remote.fetchedAt};
});fs.writeFileSync('data/library-profiles.json',JSON.stringify(profiles,null,2)+'\n');
