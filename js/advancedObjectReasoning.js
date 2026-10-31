/* advancedObjectReasoning.js
 * First-class multi-arrow and irregular-curve reasoning.
 * The logical state is canonical; SVG is only a view of that state.
 */
(function(){
 'use strict';
 const K=window.FigureKit, DR=window.DynamicReasoning;
 if(!K||!DR) throw new Error('AdvancedObjectReasoning requires FigureKit and DynamicReasoning');
 const clone=K.clone, NS='http://www.w3.org/2000/svg';
 const hash=s=>window.QuestionBank.hash(String(s))>>>0;
 function rng(seed){let a=hash(seed);return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
 const pick=(r,a)=>a[Math.floor(r()*a.length)], ri=(r,a,b)=>a+Math.floor(r()*(b-a+1));
 const ARROW_ANCHORS=[[100,30],[132,43],[145,75],[132,107],[100,120],[68,107],[55,75],[68,43]];
 const norm=a=>((a%360)+360)%360;
 const rotatePoint=(p,degrees,cx=100,cy=75)=>{const t=degrees*Math.PI/180,dx=p[0]-cx,dy=p[1]-cy;return [+(cx+dx*Math.cos(t)-dy*Math.sin(t)).toFixed(3),+(cy+dx*Math.sin(t)+dy*Math.cos(t)).toFixed(3)]};
 const OBJECT_RULES={
  arrowGroupRotate90:{skill:'multi-object-direction',category:'group-orientation',weight:1.8,description:'Rotate the entire arrow arrangement 90° clockwise, including arrow positions and directions.'},
  arrowDirectionsQuarterTurn:{skill:'multi-object-direction',category:'arrow-direction',weight:1.4,description:'Turn every arrow 90° clockwise without moving its position.'},
  arrowInvertAll:{skill:'directional-relationships',category:'arrow-direction',weight:1.2,description:'Reverse the direction of every arrow while keeping the positions fixed.'},
  arrowAddOne:{skill:'visual-quantitative',category:'arrow-count',weight:1.5,description:'Add one arrow in the next available position.'},
  arrowRemoveOne:{skill:'visual-quantitative',category:'arrow-count',weight:1.6,description:'Remove the final arrow from the arrangement.'},
  arrowMoveCW:{skill:'spatial-position',category:'arrow-position',weight:1.7,description:'Move every arrow one position clockwise while preserving its direction.'},
  arrowSwapDirections:{skill:'spatial-relationship',category:'arrow-direction',weight:1.8,description:'Exchange the directions of the first two arrows without exchanging their positions.'},
  curveRotate90:{skill:'curvilinear-spatial-reasoning',category:'curve-orientation',weight:1.8,description:'Rotate the complete doodle 90° clockwise around its centre.'},
  curveReflectH:{skill:'curvilinear-spatial-reasoning',category:'curve-reflection',weight:1.9,description:'Reflect the complete doodle from left to right.'},
  curveAddLoop:{skill:'curve-structure',category:'loop-count',weight:1.8,description:'Add one closed loop to the doodle.'},
  curveRemoveLoop:{skill:'curve-structure',category:'loop-count',weight:2.0,description:'Remove one closed loop from the doodle.'},
  curveAddLobe:{skill:'curve-structure',category:'lobe-count',weight:1.7,description:'Add one open curved lobe to the doodle.'},
  curveRemoveLobe:{skill:'curve-structure',category:'lobe-count',weight:1.9,description:'Remove the final open curved lobe.'},
  curveScaleUp:{skill:'curvilinear-spatial-reasoning',category:'curve-scale',weight:1.2,description:'Enlarge the complete doodle by 15% around its centre.'},
  curveScaleDown:{skill:'curvilinear-spatial-reasoning',category:'curve-scale',weight:1.3,description:'Reduce the complete doodle by 15% around its centre.'},
  curveAddBend:{skill:'curve-structure',category:'bend-count',weight:1.8,description:'Add one visible bend to the main curved stroke.'}
 };
 const INVERSE={arrowGroupRotate90:'arrowGroupRotate270',arrowDirectionsQuarterTurn:'arrowDirectionsQuarterTurnReverse',arrowInvertAll:'arrowInvertAll',arrowAddOne:'arrowRemoveOne',arrowRemoveOne:'arrowAddOne',arrowMoveCW:'arrowMoveCCW',curveRotate90:'curveRotate270',curveReflectH:'curveReflectH',curveAddLoop:'curveRemoveLoop',curveRemoveLoop:'curveAddLoop',curveAddLobe:'curveRemoveLobe',curveRemoveLobe:'curveAddLobe',curveScaleUp:'curveScaleDown',curveScaleDown:'curveScaleUp',curveAddBend:'curveRemoveBend'};
 const OPPOSITES=[['arrowAddOne','arrowRemoveOne'],['curveAddLoop','curveRemoveLoop'],['curveAddLobe','curveRemoveLobe'],['curveScaleUp','curveScaleDown']];
 Object.entries(OBJECT_RULES).forEach(([id,rule])=>{rule.id=id;rule.inputRequirements=[id.startsWith('arrow')?'arrows':'strokes'];rule.outputProperties=[id.startsWith('arrow')?'arrows':'strokes'];rule.applicableFigureProperties=rule.outputProperties;rule.constraints={bounded:true,preconditions:id==='arrowRemoveOne'?['at least 3 arrows']:id==='curveRemoveLoop'?['at least one closed loop']:id==='curveRemoveLobe'?['at least one open lobe']:['valid structured object state']};rule.compatibleWith=Object.keys(OBJECT_RULES).filter(other=>other!==id&&OBJECT_RULES[other].category!==rule.category&&!OPPOSITES.some(pair=>pair.includes(id)&&pair.includes(other)));rule.independentValidationMethod='independentObjectSolve'});
 // Kept in a separate registry so legacy rule selection remains isolated.
 function makeArrowState(r){const n=ri(r,3,4),slots=[0,1,2,3,4,5,6,7].sort(()=>r()-.5).slice(0,n).sort((a,b)=>a-b);return {kind:'arrowGroup',arrows:slots.map((slot,i)=>({id:`a${i}`,x:ARROW_ANCHORS[slot][0],y:ARROW_ANCHORS[slot][1],slot,dir:ri(r,0,3)*90}))}}
 function makeCurveState(r){const templates=[[[62,48],[82,35],[112,45],[126,66],[105,78],[76,70],[68,91],[95,108],[126,96]],[[58,70],[72,44],[92,42],[106,62],[91,77],[70,86],[82,108],[112,104],[132,78]],[[62,52],[85,38],[104,56],[91,73],[68,78],[74,101],[102,110],[127,91],[116,68]]];
  const main=clone(pick(r,templates));main.forEach(p=>{p[0]+=ri(r,-5,5);p[1]+=ri(r,-5,5)});
  const strokes=[{id:'main',type:'main',points:main,closed:false}];
  if(r()>.58)strokes.push(makeLoop('loop0',ri(r,78,122),ri(r,55,95),ri(r,9,13)));
  if(r()>.78)strokes.push(makeLobe('lobe0',ri(r,76,124),ri(r,54,98),r()>.5?1:-1));
  return {kind:'doodle',strokes};
 }
 function makeLoop(id,cx,cy,rad){const pts=[];for(let i=0;i<8;i++){const a=i*Math.PI/4;pts.push([+(cx+rad*Math.cos(a)).toFixed(2),+(cy+rad*Math.sin(a)).toFixed(2)])}return {id,type:'loop',points:pts,closed:true}}
 function makeLobe(id,cx,cy,flip=1){return {id,type:'lobe',closed:false,points:[[cx-12,cy],[cx-8,cy-13*flip],[cx+8,cy-13*flip],[cx+12,cy]]}}
 function applyArrowRule(s,id){const z=clone(s),a=z.arrows;
  switch(id){
   case 'arrowGroupRotate90':a.forEach(x=>{[x.x,x.y]=rotatePoint([x.x,x.y],90);x.dir=norm(x.dir+90);x.slot=(x.slot+2)%8});break;
   case 'arrowDirectionsQuarterTurn':a.forEach(x=>x.dir=norm(x.dir+90));break;
   case 'arrowInvertAll':a.forEach(x=>x.dir=norm(x.dir+180));break;
   case 'arrowAddOne':{if(a.length>=8)throw Error('Cannot add an arrow: all positions occupied');const slot=[0,1,2,3,4,5,6,7].find(i=>!a.some(x=>x.slot===i));const last=a[a.length-1];a.push({id:`a${a.length}`,x:ARROW_ANCHORS[slot][0],y:ARROW_ANCHORS[slot][1],slot,dir:norm(last.dir+90)});break}
   case 'arrowRemoveOne':if(a.length<=2)throw Error('Cannot remove an arrow below two objects');a.pop();break;
   case 'arrowMoveCW':a.forEach(x=>{x.slot=(x.slot+1)%8;x.x=ARROW_ANCHORS[x.slot][0];x.y=ARROW_ANCHORS[x.slot][1]});break;
   case 'arrowSwapDirections':if(a.length<2)throw Error('Two arrows are required');[a[0].dir,a[1].dir]=[a[1].dir,a[0].dir];break;
   default:throw Error(`Unknown arrow rule ${id}`)
  }return z;
 }
 function transformCurvePoint(p,id){let [x,y]=p;switch(id){case 'curveRotate90':[x,y]=rotatePoint([x,y],90);break;case 'curveReflectH':x=200-x;break;case 'curveScaleUp':x=100+(x-100)*1.15;y=75+(y-75)*1.15;break;case 'curveScaleDown':x=100+(x-100)*.85;y=75+(y-75)*.85;break;}return [+x.toFixed(3),+y.toFixed(3)]}
 function applyCurveRule(s,id){const z=clone(s),st=z.strokes;
  switch(id){
   case 'curveRotate90':case 'curveReflectH':case 'curveScaleUp':case 'curveScaleDown':st.forEach(x=>x.points=x.points.map(p=>transformCurvePoint(p,id)));break;
   case 'curveAddLoop':{const occupied=st.filter(x=>x.type==='loop').length;z.strokes.push(makeLoop(`loop${occupied+1}`,occupied%2?122:78,occupied%2?91:57,10+occupied%3*2));break}
   case 'curveRemoveLoop':{const i=st.map(x=>x.type).lastIndexOf('loop');if(i<0)throw Error('No loop to remove');st.splice(i,1);break}
   case 'curveAddLobe':{const n=st.filter(x=>x.type==='lobe').length;z.strokes.push(makeLobe(`lobe${n+1}`,n%2?126:74,n%2?98:52,n%2?-1:1));break}
   case 'curveRemoveLobe':{const i=st.map(x=>x.type).lastIndexOf('lobe');if(i<0)throw Error('No lobe to remove');st.splice(i,1);break}
   case 'curveAddBend':{const m=st.find(x=>x.type==='main');if(!m||m.points.length>=16)throw Error('Main curve cannot accept another bend');const idx=Math.floor(m.points.length/2),p=m.points[idx],prev=m.points[idx-1],next=m.points[idx+1];m.points.splice(idx,0,[+(p[0]+(next[1]-prev[1])*.18).toFixed(2),+(p[1]-(next[0]-prev[0])*.18).toFixed(2)]);break}
   default:throw Error(`Unknown curve rule ${id}`)
  }return z;
 }
 function applyObjectRule(state,id){return state.kind==='arrowGroup'?applyArrowRule(state,id):applyCurveRule(state,id)}
 function applyRules(state,rules){return rules.reduce((s,r)=>applyObjectRule(s,typeof r==='string'?r:r.id),clone(state))}
 // Independent solver: separate switch and explicit coordinate/structure calculations; never calls applyObjectRule.
 function independentObjectSolve(spec){let s=clone(spec.startState);for(const entry of spec.ruleSequence){const id=typeof entry==='string'?entry:entry.id;
  if(s.kind==='arrowGroup'){const a=s.arrows;switch(id){
   case 'arrowGroupRotate90':a.forEach(x=>{const t=Math.PI/2,dx=x.x-100,dy=x.y-75;x.x=+(100-dy).toFixed(3);x.y=+(75+dx).toFixed(3);x.dir=norm(x.dir+90);x.slot=(x.slot+2)%8});break;
   case 'arrowDirectionsQuarterTurn':for(const x of a)x.dir=norm(x.dir+90);break;
   case 'arrowInvertAll':for(const x of a)x.dir=norm(x.dir+180);break;
   case 'arrowAddOne':{const free=[0,1,2,3,4,5,6,7].filter(k=>!a.some(x=>x.slot===k))[0];if(free===undefined)throw Error('Solver: no free arrow anchor');a.push({id:`a${a.length}`,x:ARROW_ANCHORS[free][0],y:ARROW_ANCHORS[free][1],slot:free,dir:norm(a[a.length-1].dir+90)});break}
   case 'arrowRemoveOne':if(a.length<=2)throw Error('Solver: minimum arrow count');a.splice(a.length-1,1);break;
   case 'arrowMoveCW':for(const x of a){x.slot=(x.slot+1)%8;x.x=ARROW_ANCHORS[x.slot][0];x.y=ARROW_ANCHORS[x.slot][1]}break;
   case 'arrowSwapDirections':if(a.length<2)throw Error('Solver: missing arrow pair');{const d=a[0].dir;a[0].dir=a[1].dir;a[1].dir=d}break;
   default:throw Error('Solver does not recognise '+id)
  }}else{const st=s.strokes;switch(id){
   case 'curveRotate90':case 'curveReflectH':case 'curveScaleUp':case 'curveScaleDown':st.forEach(x=>x.points=x.points.map(p=>{let X=p[0],Y=p[1];if(id==='curveRotate90'){const dx=X-100,dy=Y-75;X=100-dy;Y=75+dx}else if(id==='curveReflectH')X=200-X;else if(id==='curveScaleUp'){X=100+(X-100)*1.15;Y=75+(Y-75)*1.15}else{X=100+(X-100)*.85;Y=75+(Y-75)*.85}return [+X.toFixed(3),+Y.toFixed(3)]}));break;
   case 'curveAddLoop':{const n=st.filter(x=>x.type==='loop').length,cx=n%2?122:78,cy=n%2?91:57,rad=10+n%3*2,pts=Array.from({length:8},(_,i)=>{const t=i*Math.PI/4;return [+(cx+rad*Math.cos(t)).toFixed(2),+(cy+rad*Math.sin(t)).toFixed(2)]});st.push({id:`loop${n+1}`,type:'loop',points:pts,closed:true});break}
   case 'curveRemoveLoop':{let i=-1;for(let k=0;k<st.length;k++)if(st[k].type==='loop')i=k;if(i<0)throw Error('Solver: no loop');st.splice(i,1);break}
   case 'curveAddLobe':{const n=st.filter(x=>x.type==='lobe').length,cx=n%2?126:74,cy=n%2?98:52,flip=n%2?-1:1;st.push({id:`lobe${n+1}`,type:'lobe',closed:false,points:[[cx-12,cy],[cx-8,cy-13*flip],[cx+8,cy-13*flip],[cx+12,cy]]});break}
   case 'curveRemoveLobe':{let i=-1;for(let k=0;k<st.length;k++)if(st[k].type==='lobe')i=k;if(i<0)throw Error('Solver: no lobe');st.splice(i,1);break}
   case 'curveAddBend':{const m=st.find(x=>x.type==='main');if(!m||m.points.length>=16)throw Error('Solver: cannot add bend');const i=Math.floor(m.points.length/2),p=m.points[i],pr=m.points[i-1],nx=m.points[i+1];m.points.splice(i,0,[+(p[0]+(nx[1]-pr[1])*.18).toFixed(2),+(p[1]-(nx[0]-pr[0])*.18).toFixed(2)]);break}
   default:throw Error('Solver does not recognise '+id)
  }}
 }return s}
 function stateKey(s){return JSON.stringify(s)}
 function figure(s){return s.kind==='arrowGroup'?{kind:'arrowGroup',arrows:clone(s.arrows)}:{kind:'doodle',strokes:clone(s.strokes)}}
 function stateDistance(a,b){if(a===b)return 0;if(!a||!b||typeof a!=='object'||typeof b!=='object')return 1;const keys=new Set([...Object.keys(a),...Object.keys(b)]);let d=0;for(const k of keys)d+=stateDistance(a[k],b[k]);return d}
 function candidateDistractors(start,rules,target,seed){
  const pool=[];const add=(state,category,description)=>{const k=stateKey(state);if(k!==stateKey(target)&&!pool.some(x=>stateKey(x.state)===k))pool.push({state,category,description})};
  rules.forEach((rule,i)=>{try{add(applyRules(start,rules.filter((_,j)=>j!==i)),'omitted-rule',`Applied every rule except ${OBJECT_RULES[rule.id].description}`)}catch(e){}});
  try{add(applyRules(start,[...rules].reverse()),'wrong-order','Applied the same transformations in reverse order')}catch(e){}
  if(start.kind==='arrowGroup'){
   const z1=clone(target);z1.arrows[0].dir=norm(z1.arrows[0].dir+90);add(z1,'wrong-component','Changed the direction of one arrow incorrectly');
   const z2=clone(target);z2.arrows[0].dir=norm(z2.arrows[0].dir+180);add(z2,'direction-inversion-error','Reversed one arrow instead of applying the group relationship');
   const z3=clone(target);if(z3.arrows.length>1){const a=z3.arrows[0],b=z3.arrows[1];[a.x,b.x]=[b.x,a.x];[a.y,b.y]=[b.y,a.y];[a.slot,b.slot]=[b.slot,a.slot]}else z3.arrows[0].x+=13;add(z3,'position-swap-error','Swapped positions without preserving the correct directional relationship');
   const z4=clone(target);const free=[0,1,2,3,4,5,6,7].find(k=>!z4.arrows.some(x=>x.slot===k));if(free!==undefined)z4.arrows.push({id:`wrong-${z4.arrows.length}`,x:ARROW_ANCHORS[free][0],y:ARROW_ANCHORS[free][1],slot:free,dir:0});else z4.arrows.pop();add(z4,'count-error','Changed the number of arrows by one');
  }else{
   const z1=clone(target),m1=z1.strokes.find(x=>x.type==='main'),p1=m1.points[Math.floor(m1.points.length/2)];p1[0]=+(p1[0]+9).toFixed(2);p1[1]=+(p1[1]-7).toFixed(2);add(z1,'wrong-curve-segment','Applied the transformation to the wrong curved segment');
   const z2=clone(target);z2.strokes.push(makeLoop('misread-loop',116,106,8));add(z2,'extra-loop','Added one loop too many');
   const z3=clone(target);const loopIndex=z3.strokes.map(x=>x.type).lastIndexOf('loop');if(loopIndex>=0)z3.strokes.splice(loopIndex,1);else z3.strokes.push(makeLobe('misread-lobe',125,50,-1));add(z3,'loop-count-error','Miscounted the closed loops or curved sections');
   const z4=clone(target);z4.strokes=z4.strokes.map(st=>({...st,points:st.points.map(p=>[+(100+(p[0]-100)*1.12).toFixed(2),+(75+(p[1]-75)*1.12).toFixed(2)])}));add(z4,'scale-error','Applied the wrong scale to the whole doodle');
  }
  const r=rng(seed);let attempts=0;
  while(pool.length<4&&attempts++<50){const z=clone(target);if(z.kind==='arrowGroup'){const i=Math.floor(r()*z.arrows.length);z.arrows[i].dir=norm(z.arrows[i].dir+90*(1+Math.floor(r()*3)));}else{const m=z.strokes.find(x=>x.type==='main'),i=1+Math.floor(r()*Math.max(1,m.points.length-2));m.points[i][0]=+(m.points[i][0]+(r()>.5?7:-7)).toFixed(2)}add(z,'near-miss','Made a local directional or curve-control-point error')}
  if(pool.length<4)throw Error('Could not construct four distinct misconception distractors');return pool.slice(0,4);
 }
 function fingerprint(spec){return [spec.cognitiveSkill,spec.objectType,spec.format,spec.composition,spec.compositionRules.join('>'),spec.ruleSequence.map(x=>x.id).join('>'),`n${spec.compositionRules.length}`,`d${spec.difficulty.score}`].join('|')}
 function chooseRules(r,type,profile,difficulty,start){const pool=Object.keys(OBJECT_RULES).filter(id=>id.startsWith(type==='arrows'?'arrow':'curve'));const max=profile==='Su'?Math.min(2,difficulty<=2?1:2):Math.min(4,difficulty<=2?2:difficulty<=4?3:4),min=profile==='Su'?1:Math.min(2,max);const want=ri(r,min,max),chosen=[],cats=new Set();let attempts=0;while(chosen.length<want&&attempts++<300){const id=pick(r,pool),cat=OBJECT_RULES[id].category;if(chosen.some(x=>x.id===id)||cats.has(cat)||OPPOSITES.some(p=>p.includes(id)&&p.some(v=>chosen.some(x=>x.id===v))))continue;if(id==='arrowRemoveOne'&&start.arrows.length<=2)continue;if(id==='arrowAddOne'&&start.arrows.length>=6)continue;if(id==='arrowSwapDirections'&&start.arrows.length<2)continue;if(id==='curveRemoveLoop'&&!start.strokes.some(x=>x.type==='loop'))continue;if(id==='curveRemoveLobe'&&!start.strokes.some(x=>x.type==='lobe'))continue;if(id==='curveAddBend'&&(start.strokes.find(x=>x.type==='main')?.points.length||20)>=16)continue;chosen.push({id});cats.add(cat)}if(chosen.length<want){for(const id of pool){if(chosen.length>=want)break;if(chosen.some(x=>x.id===id)||cats.has(OBJECT_RULES[id].category))continue;if(id==='curveRemoveLoop'&&!start.strokes.some(x=>x.type==='loop'))continue;if(id==='arrowRemoveOne'&&start.arrows.length<=2)continue;chosen.push({id});cats.add(OBJECT_RULES[id].category)}}if(!chosen.length)throw Error('No compatible object reasoning rules');return chosen}
 function generate(seed,profile,difficultyOverride,typeOverride){const r=rng(seed),difficulty=difficultyOverride??(profile==='Su'?ri(r,1,3):ri(r,2,5)),type=typeOverride|| (r()<.5?'arrows':'curves'),start=type==='arrows'?makeArrowState(r):makeCurveState(r),rules=chooseRules(r,type,profile,difficulty,start);let format=type==='arrows'?pick(r,['sequence','analogy','matching']):pick(r,['sequence','analogy','matching']);if((rules.some(x=>['arrowRemoveOne','curveRemoveLoop','curveRemoveLobe'].includes(x.id))||(rules.some(x=>x.id==='arrowAddOne')&&start.arrows.length>3))&&format==='sequence')format=pick(r,['analogy','matching']);const composition=rules.length>1&&r()>.78?'alternating':'simultaneous';const step=(s,i)=>composition==='alternating'?applyObjectRule(s,rules[i%rules.length].id):applyRules(s,rules);
  let examples=[],answerStart,target,answerRules;
  if(format==='analogy'||format==='matching'){const a=clone(start),b=applyRules(a,rules),c=type==='arrows'?makeArrowState(r):makeCurveState(r);if(type==='curves'&&rules.some(x=>x.id==='curveRemoveLoop')&&!c.strokes.some(x=>x.type==='loop')){const loop=start.strokes.find(x=>x.type==='loop');if(loop)c.strokes.push(clone(loop))}if(type==='curves'&&rules.some(x=>x.id==='curveRemoveLobe')&&!c.strokes.some(x=>x.type==='lobe')){const lobe=start.strokes.find(x=>x.type==='lobe');if(lobe)c.strokes.push(clone(lobe))}examples=[figure(a),figure(b),figure(c)];answerStart=c;answerRules=rules;target=applyRules(c,rules)}
  else if(format==='transformation'||format==='spatial-arrangement'){examples=[figure(start)];answerStart=clone(start);answerRules=rules;target=applyRules(start,rules)}
  else{let s=clone(start);for(let i=0;i<4;i++){examples.push(figure(s));s=step(s,i)}answerStart=clone(s);answerRules=composition==='alternating'?[rules[4%rules.length]]:rules;target=step(s,4)}
  const raw=rules.reduce((n,x)=>n+OBJECT_RULES[x.id].weight,0)+(composition==='alternating'?1.2:0)+(format==='spatial-arrangement'?0.7:0);const score=Math.max(1,Math.min(profile==='Su'?3:5,Math.round(.7+raw*.55+(rules.length-1)*.28)));
  const spec={version:2,engine:'advanced-object-reasoning',objectType:type,profile,format,composition,startState:clone(answerStart),ruleSequence:clone(answerRules),compositionRules:rules.map(x=>x.id),cognitiveSkill:[...new Set(rules.map(x=>OBJECT_RULES[x.id].skill))].join('+'),ruleDetails:rules.map(x=>({id:x.id,description:OBJECT_RULES[x.id].description,cognitiveSkill:OBJECT_RULES[x.id].skill,category:OBJECT_RULES[x.id].category,weight:OBJECT_RULES[x.id].weight})),difficulty:{score,ruleWeight:raw,reasoningSteps:rules.length+(composition==='alternating'?1:0),distractorSimilarity:'near-miss'}};
  const independentlySolved=independentObjectSolve(spec);if(stateKey(independentlySolved)!==stateKey(target))throw Error('Independent object solver disagrees with generated target');
  const ds=candidateDistractors(answerStart,answerRules,target,seed),pairs=[{state:target,category:'correct',description:'Satisfies every transformation in the logical specification'},...ds.map(x=>({state:x.state,category:x.category,description:x.description}))];
  const sh=rng(`${seed}|option-order`);for(let i=pairs.length-1;i>0;i--){const j=Math.floor(sh()*(i+1));[pairs[i],pairs[j]]=[pairs[j],pairs[i]]}
  const options=pairs.map(x=>figure(x.state)),correctIndex=pairs.findIndex(x=>x.category==='correct'),keys=options.map(stateKey);if(new Set(keys).size!==5)throw Error('Object reasoning generated duplicate visual options: '+pairs.map(x=>x.category).join(',')+' / '+keys.map((x,i)=>keys.indexOf(x)===i?'new':'dup'+keys.indexOf(x)).join(','));
  const semanticFingerprint=fingerprint({...spec,difficulty:{score}});const label=type==='arrows'?'Multi-arrow reasoning':'Irregular curve reasoning';const prompt=format==='analogy'?'The first figure changes into the second. Apply the same relationship to the third figure.':format==='matching'?'Study the curved figure relationship. Which option follows the same transformation?':format==='transformation'?'Apply all the stated visual relationships. Which option is the result?':format==='spatial-arrangement'?'Study how the arrows move and change direction. Which arrangement comes next?':'Study the sequence of figures. Which figure comes next?';
  const q={id:`obj-${hash(seed).toString(16)}`,questionId:`obj-${hash(seed).toString(16)}`,family:'dynamicComposition',familyId:'dynamicObjectComposition',label,subfamily:rules.map(x=>x.id).join('-'),format,seed,difficulty:score,examples,prompt,options,correctIndex,rule:rules.map(x=>OBJECT_RULES[x.id].description).join(' '),steps:rules.map((x,i)=>`${i+1}. ${OBJECT_RULES[x.id].description}`),errorCategory:spec.cognitiveSkill,repair:'Track each object separately. Check direction, position and structural changes one rule at a time.',compound:rules.length>1,ruleCount:rules.length,estimatedSeconds:22+score*4,primaryRule:rules.map(x=>x.id).join('+'),secondaryRules:rules.slice(1).map(x=>x.id),cognitiveDemand:rules.length>1?'multi-rule':'single-step',ruleSignature:rules.map(x=>x.id).join('>'),structuralSignature:semanticFingerprint,visualSignature:hash(examples.map(stateKey).join('|')).toString(16),visualStructure:type==='arrows'?'multi-arrow-state':'irregular-curve-state',distractorLogic:ds.map(x=>`${x.category}: ${x.description}`).join('; '),metadata:{engine:'dynamic-object-v2',misconceptions:pairs.map(x=>({category:x.category,description:x.description})),semanticFingerprint,solver:{status:'passed',method:'independent-object-rule-replay',uniqueCorrect:1}},logicalSpec:spec,semanticFingerprint};
  validate(q);return q;
 }
 function validate(q){const s=q.logicalSpec;if(!s||s.engine!=='advanced-object-reasoning')throw Error('Missing advanced object specification');if(q.options.length!==5)throw Error('Five options required');const solved=independentObjectSolve(s),key=stateKey(solved),optionKeys=q.options.map(f=>stateKey(s.startState.kind==='arrowGroup'?{kind:'arrowGroup',arrows:f.arrows}:{kind:'doodle',strokes:f.strokes}));if(new Set(optionKeys).size!==5)throw Error('Duplicate advanced-object options');if(optionKeys.filter(x=>x===key).length!==1||optionKeys[q.correctIndex]!==key)throw Error('Independent solver did not identify exactly one correct answer');if(q.metadata?.solver?.status!=='passed')throw Error('Independent solver status missing');if(!q.metadata?.misconceptions||q.metadata.misconceptions.length!==5)throw Error('Misconception metadata incomplete');return true}
 // SVG extension: arrows and doodles are rendered from the structured state only.
 const baseRender=K.renderFigure;
 function svgEl(tag,attrs,parent){const e=document.createElementNS(NS,tag);Object.entries(attrs||{}).forEach(([k,v])=>e.setAttribute(k,String(v)));parent.appendChild(e);return e}
 function curvePath(points,closed){if(points.length<2)return '';const pts=points,fmt=p=>`${p[0].toFixed(2)} ${p[1].toFixed(2)}`;let d=`M ${fmt(pts[0])}`;const n=closed?pts.length:pts.length-1;for(let i=0;i<n;i++){let p0=pts[(i-1+pts.length)%pts.length],p3=pts[(i+2)%pts.length];const p1=pts[i],p2=pts[(i+1)%pts.length];if(!closed&&i===0)p0=p1;if(!closed&&i===n-1)p3=p2;const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];d+=` C ${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`}return d+(closed?' Z':'')}
 K.renderFigure=function(f,opts={}){if(f?.kind!=='arrowGroup'&&f?.kind!=='doodle')return baseRender(f,opts);const svg=svgEl('svg',{viewBox:'0 0 200 150',role:'img','aria-label':opts.label||(f.kind==='arrowGroup'?'Multi-arrow reasoning figure':'Irregular curved-line reasoning figure'),preserveAspectRatio:'xMidYMid meet'},document.createDocumentFragment());
  if(f.kind==='arrowGroup'){(f.arrows||[]).forEach(a=>{const rad=a.dir*Math.PI/180,dx=Math.sin(rad),dy=-Math.cos(rad),len=27,head=9,x1=a.x-dx*len*.55,y1=a.y-dy*len*.55,x2=a.x+dx*len*.55,y2=a.y+dy*len*.55;svgEl('line',{x1,y1,x2,y2,stroke:'#171b24','stroke-width':3.2,'stroke-linecap':'round'},svg);const bx=x2-dx*head,by=y2-dy*head,px=-dy*5.5,py=dx*5.5;svgEl('path',{d:`M ${x2} ${y2} L ${bx+px} ${by+py} M ${x2} ${y2} L ${bx-px} ${by-py}`,fill:'none',stroke:'#171b24','stroke-width':3.2,'stroke-linecap':'round','stroke-linejoin':'round'},svg)})}
  else{(f.strokes||[]).forEach(st=>svgEl('path',{d:curvePath(st.points||[],!!st.closed),fill:'none',stroke:'#252a34','stroke-width':2.25,'stroke-linecap':'round','stroke-linejoin':'round'},svg))}
  return svg;
 };
 const oldMake=DR.makeQuestion,oldValidate=DR.validate;
 DR.makeQuestion=function(seed,profile,difficulty){const r=rng(`${seed}|object-type`);if(r()<.44)return generate(seed,profile,difficulty);return oldMake(seed,profile,difficulty)};
 DR.validate=function(q){return q?.logicalSpec?.engine==='advanced-object-reasoning'?validate(q):oldValidate(q)};
 DR.objectRules=OBJECT_RULES;DR.makeObjectQuestion=generate;DR.validateObjectQuestion=validate;DR.independentObjectSolve=independentObjectSolve;
 window.AdvancedObjectReasoning={RULES:OBJECT_RULES,makeQuestion:generate,validate,independentSolve:independentObjectSolve,applyRules,makeArrowState,makeCurveState};
})();
