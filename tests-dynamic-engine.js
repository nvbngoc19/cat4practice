#!/usr/bin/env node
'use strict';
// Acceptance suite for the logic-first engine and advanced arrow/curve systems.
// Uses a tiny SVG DOM shim so Node can verify that every figure renders non-empty.
class FakeElement {
  constructor(tag){this.tagName=tag;this.attributes={};this.children=[];this.textContent='';}
  setAttribute(k,v){this.attributes[k]=String(v)}
  appendChild(x){this.children.push(x);return x}
  get outerHTML(){return `<${this.tagName}>${this.children.map(x=>x.outerHTML||'').join('')}${this.textContent}</${this.tagName}>`}
}
global.window=global;
global.document={createElementNS:(ns,tag)=>new FakeElement(tag),createDocumentFragment:()=>new FakeElement('#fragment')};
const storage=new Map();global.localStorage={getItem(k){return storage.has(k)?storage.get(k):null},setItem(k,v){storage.set(k,String(v))},removeItem(k){storage.delete(k)}};
const path=require('path');const root=__dirname;
for(const file of ['figureRenderer','geometryKernel','questionGenerators','diversityEngine','diversityExpansion','ruleComposition','dynamicReasoningEngine','advancedObjectReasoning','testEngine'])require(path.join(root,'js',file+'.js'));
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const stable=x=>JSON.stringify(x);
const summary={geometry:{overlap:false,crossing:false},responsiveStyles:false,generated:{Su:0,Kem:0},advanced:{arrows:0,curves:0},rules:{},formats:{},difficulty:{Su:{},Kem:{}},ruleCounts:{Su:{},Kem:{}},semantic:{Su:{unique:0,duplicates:0,uniqueRuleCombinations:0},Kem:{unique:0,duplicates:0,uniqueRuleCombinations:0}},renderChecks:0,legacyFamilies:{passed:0,failed:[]},timedTests:{passed:0,failed:[],questions:0,duplicates:0,recentWindowDuplicates:0,globalUnique:0,globalDuplicates:0,advancedArrows:0,advancedCurves:0},reproducibility:{sameSeed:false,differentSeeds:false},solverFailures:0};
for(const profile of ['Su','Kem']){
 const profileFingerprints=new Set(),profileCombos=new Set();
 for(let i=0;i<1000;i++){
  const seed=`acceptance-${profile}-${i}`;let q;
  try{q=DynamicReasoning.makeQuestion(seed,profile);DynamicReasoning.validate(q)}catch(e){summary.solverFailures++;throw new Error(`${profile} generation ${i} failed: ${e.message}`)}
  summary.generated[profile]++;
  const spec=q.logicalSpec;
  const fp=q.semanticFingerprint||q.structuralSignature; if(profileFingerprints.has(fp))summary.semantic[profile].duplicates++; profileFingerprints.add(fp); profileCombos.add(q.primaryRule||q.ruleSignature);
  const rc=(spec.compositionRules||[]).length;const rck=rc>=4?'4+':String(rc);summary.ruleCounts[profile][rck]=(summary.ruleCounts[profile][rck]||0)+1;
  if(spec.engine==='advanced-object-reasoning')summary.advanced[spec.objectType==='arrows'?'arrows':'curves']++;
  for(const id of spec.compositionRules||[])summary.rules[id]=(summary.rules[id]||0)+1;
  summary.formats[q.format]=(summary.formats[q.format]||0)+1;
  summary.difficulty[profile][q.difficulty]=(summary.difficulty[profile][q.difficulty]||0)+1;
  assert(q.options.length===5,`${seed}: expected five options`);
  assert(new Set(q.options.map(stable)).size===5,`${seed}: duplicate option`);
  assert(q.correctIndex>=0&&q.correctIndex<5,`${seed}: bad correct index`);
  for(const f of [...q.examples,...q.options]){
   const svg=FigureKit.renderFigure(f,{label:'acceptance'});
   assert(svg&&svg.tagName==='svg'&&svg.children.length>0,`${seed}: blank SVG for ${f.kind}`);
   summary.renderChecks++;
  }
 }
 summary.semantic[profile].unique=profileFingerprints.size;summary.semantic[profile].uniqueRuleCombinations=profileCombos.size;
}
// Geometry regression: overlapping collinear segments must merge into one graph component.
const overlap=GeometryKernel.metrics([[0,0,10,0],[5,0,15,0]]);
summary.geometry.overlap=overlap.connectedComponents===1&&overlap.endpoints===2&&overlap.overlappingSegments===1;
const crossing=GeometryKernel.metrics([[0,0,10,10],[0,10,10,0]]);
summary.geometry.crossing=crossing.connectedComponents===1&&crossing.properCrossings===1;
assert(summary.geometry.overlap,'Collinear overlap topology regression');assert(summary.geometry.crossing,'Proper crossing topology regression');
const fs=require('fs'),html=fs.readFileSync(path.join(root,'styles.css'),'utf8'),indexHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');summary.responsiveStyles=html.includes('@media(max-width:700px)')&&html.includes('@media(max-width:430px)');assert(summary.responsiveStyles,'Responsive layout media queries missing');for(const src of [...indexHtml.matchAll(/(?:src|href)="(js\/[^"]+|styles\.css)"/g)].map(m=>m[1]))assert(fs.existsSync(path.join(root,src)),`Missing local app asset ${src}`);
// Every original family remains callable and valid.
for(const family of QuestionBank.generateFamilies){
 try{const q=QuestionBank.generate(family,`legacy-check-${family}`,3);QuestionBank.validateQuestion(q);summary.legacyFamilies.passed++}
 catch(e){summary.legacyFamilies.failed.push({family,message:e.message})}
}
assert(summary.legacyFamilies.failed.length===0,'Legacy family compatibility regression');
// Reproducibility and seed variation.
const a=DynamicReasoning.makeQuestion('repeatable-seed-001','Kem',4),b=DynamicReasoning.makeQuestion('repeatable-seed-001','Kem',4),c=DynamicReasoning.makeQuestion('repeatable-seed-002','Kem',4);
summary.reproducibility.sameSeed=stable(a)===stable(b);summary.reproducibility.differentSeeds=stable(a)!==stable(c);
assert(summary.reproducibility.sameSeed,'Same seed did not reproduce');assert(summary.reproducibility.differentSeeds,'Different seeds did not vary');
// 100 full timed tests, 50 per student profile.
const allTimedFingerprints=new Set();
for(const profile of ['Su','Kem'])for(let i=0;i<50;i++){
 const seed=`acceptance-timed-${profile}-${i}`;
 try{
  const previous=JSON.parse(localStorage.getItem('vinschoolNvrSemanticHistory')||'[]').flatMap(x=>x.fingerprints||[]);
  const test=TestEngine.createTest(profile,'auto',seed,{avoidRecent:true});
  assert(test.items.length===24,`${seed}: not 24 questions`);
  const fingerprints=test.items.map(x=>x.question.semanticFingerprint);
  fingerprints.forEach(x=>allTimedFingerprints.add(x));
  const unique=new Set(fingerprints).size;summary.timedTests.duplicates+=24-unique;summary.timedTests.recentWindowDuplicates+=fingerprints.filter(x=>previous.includes(x)).length;
  assert(unique===24,`${seed}: semantic duplicate within test`);
  for(const item of test.items){DynamicReasoning.validate(item.question);summary.timedTests.questions++;if(item.question.logicalSpec.engine==='advanced-object-reasoning'){if(item.question.logicalSpec.objectType==='arrows')summary.timedTests.advancedArrows++;else summary.timedTests.advancedCurves++}}
  TestEngine.moveTo(test,7);test.items.forEach((x,j)=>x.selected=j===23?(x.question.correctIndex+1)%5:x.question.correctIndex);const scored=TestEngine.scoreTest(test);assert(scored.total===24&&scored.score===23,`${seed}: scoring/navigation smoke test failed`);
  summary.timedTests.passed++;
 }catch(e){summary.timedTests.failed.push({profile,seed,message:e.message})}
}
assert(summary.timedTests.failed.length===0,'Timed-test acceptance failure');
assert(summary.timedTests.duplicates===0,'Semantic duplicate found within timed test');
assert(summary.timedTests.recentWindowDuplicates===0,'Semantic duplicate found against the previous ten tests');
summary.timedTests.globalUnique=allTimedFingerprints.size;summary.timedTests.globalDuplicates=summary.timedTests.questions-allTimedFingerprints.size;
console.log(JSON.stringify(summary,null,2));
