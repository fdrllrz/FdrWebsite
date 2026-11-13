/* ===== part 1 ===== */
(function(){
  var $=function(s,r){return(r||document).querySelector(s);},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s));};
  var calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches,root=document.documentElement;

  var snd=false,ctx;
  function blip(){if(!snd)return;try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;o.type='sine';o.frequency.setValueAtTime(320,t);o.frequency.exponentialRampToValueAtTime(760,t+.12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.18);}catch(e){}}
  $('#snd').addEventListener('click',function(){snd=!snd;this.classList.toggle('off',!snd);this.setAttribute('aria-pressed',snd);blip();});

  var DEPTH={home:0,about:15,achievements:30,family:45},cur='home';
  function applyDepth(){
    var d=Math.min(1,DEPTH[cur]/30),dark=root.classList.contains('dark');
    root.style.setProperty('--d',dark?Math.max(d,.85):d);
    $('#read').innerHTML='&#9660; '+DEPTH[cur]+' m';
  }
  $('#thm').addEventListener('click',function(){root.classList.toggle('dark');try{localStorage.setItem('fdr-theme',root.classList.contains('dark')?'dark':'light');}catch(e){}applyDepth();});

  var views=$$('.view'),ids=views.map(function(v){return v.id;});
  function count(view){$$('.num',view).forEach(function(n){var to=+n.dataset.n;if(calm){n.textContent=to;return;}var st=null;requestAnimationFrame(function f(ts){if(st===null)st=ts;var p=Math.min((ts-st)/900,1);n.textContent=Math.round(to*p);if(p<1)requestAnimationFrame(f);});});}
  function show(id,push,quiet){
    if(ids.indexOf(id)<0)id='home';cur=id;
    views.forEach(function(v){v.classList.toggle('active',v.id===id);});
    $$('.links a,.gauge a,.mi').forEach(function(a){a.classList.toggle('cur',a.getAttribute('href')==='#'+id);});
    $('#menu').classList.remove('open');window.scrollTo({top:0,behavior:'instant'});count(document.getElementById(id));applyDepth();if(!quiet)document.dispatchEvent(new CustomEvent("fdr:nav"));
    if(push){try{history.replaceState(null,'','#'+id);}catch(e){}}
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;
    var id=a.getAttribute('href').slice(1);if(ids.indexOf(id)<0)return;
    e.preventDefault();blip();
    if(id==='home'&&cur==='home'){window.scrollTo({top:0,behavior:calm?'auto':'smooth'});return;}
    show(id,true);
  });
  window.addEventListener('hashchange',function(){show(location.hash.slice(1),false);});
  show(ids.indexOf(location.hash.slice(1))>-1?location.hash.slice(1):'home',false,true);

  $$('.tabwrap').forEach(function(w){$$('.tabs button',w).forEach(function(b){b.addEventListener('click',function(){
    $$('.tabs button',w).forEach(function(x){x.classList.toggle('on',x===b);});
    $$('.tp',w).forEach(function(p){p.classList.toggle('on',p.dataset.t===b.dataset.t);});blip();});});});

  $('#mopen').addEventListener('click',function(){$('#menu').classList.add('open');blip();});
  $('#mclose').addEventListener('click',function(){$('#menu').classList.remove('open');});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')$('#menu').classList.remove('open');});

  var stage=$('#stage'),shell=$('#shell');
  if(!calm){
    stage.addEventListener('pointermove',function(e){var r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      shell.style.transform='rotateY('+(x*16).toFixed(1)+'deg) rotateX('+(-y*16).toFixed(1)+'deg)';
      shell.style.setProperty('--sx',(50+x*60).toFixed(0)+'%');shell.style.setProperty('--sy',(40+y*60).toFixed(0)+'%');});
    stage.addEventListener('pointerleave',function(){shell.style.transform='';});
  }

  var glyphs=['</>','{ }','01','#','&&','=>','[ ]','//',';','if','++','!='];
  var msgs=['Hello, World!','console.log("Hi!");','while (true) { learn(); }','git commit -m "hello"','01001000 01101001','sudo be_awesome','if (tired) coffee++;','404: boredom not found','</> keep coding','Ctrl + S saved!','return success;','print("Hello, Python!")','<h1>Hello, World!</h1>','SELECT * FROM dreams;','let future = "bright";','import creativity','// TODO: change the world','git push origin success','npm install happiness','try { fail(); } catch { learn(); }','Bug fixed!','Compiling... 100% done','Build succeeded!','python3 dream.py'];
  var sky=$('#sky'),last=-1;
  function popFx(cx,cy){
    blip();var k;do{k=Math.floor(Math.random()*msgs.length);}while(k===last);last=k;
    var t=document.createElement('div');t.className='codepop';t.textContent=msgs[k];
    t.style.left=Math.min(Math.max(cx,160),window.innerWidth-160)+'px';t.style.top=(cy-10)+'px';sky.appendChild(t);setTimeout(function(){t.remove();},2500);
    var r=document.createElement('div');r.className='burst';r.style.left=cx+'px';r.style.top=cy+'px';sky.appendChild(r);setTimeout(function(){r.remove();},550);
    if(calm)return;
    for(var m=0;m<10;m++){
      var dp=document.createElement('div'),sz=5+Math.random()*8,an=Math.random()*6.283,ds=40+Math.random()*55;
      dp.className='drop';dp.style.cssText='left:'+cx+'px;top:'+cy+'px;width:'+sz+'px;height:'+sz+'px;--x:'+Math.round(Math.cos(an)*ds)+'px;--y:'+Math.round(Math.sin(an)*ds)+'px';
      sky.appendChild(dp);(function(el){setTimeout(function(){el.remove();},800);})(dp);
    }
    for(var q=0;q<8;q++){var g=document.createElement('div');g.className='glyphp';g.textContent=glyphs[Math.floor(Math.random()*glyphs.length)];var a=q/8*6.283+Math.random()*.6;
      g.style.cssText='left:'+cx+'px;top:'+cy+'px;--x:'+Math.round(Math.cos(a)*(60+Math.random()*30))+'px;--y:'+Math.round(Math.sin(a)*(60+Math.random()*30))+'px';
      sky.appendChild(g);(function(el){setTimeout(function(){el.remove();},1200);})(g);}
  }
  var bubs=[];
  function bub(initial,tiny){
    var b=document.createElement('button');b.className='b';b.type='button';b.setAttribute('aria-label','Pop bubble');
    var s=tiny?(8+Math.random()*10):(26+Math.random()*58),d=Math.max(12,30-s*.22+Math.random()*6),depth=Math.min(1,s/84);
    b.style.cssText='width:'+s+'px;height:'+s+'px;left:'+Math.random()*94+'%;--d:'+d.toFixed(1)+'s;--dl:'+(initial?-(Math.random()*d):Math.random()*3).toFixed(1)+'s;--dx:'+Math.round(Math.random()*90-45)+'px;opacity:'+(.55+depth*.45).toFixed(2)+(tiny?';pointer-events:none;filter:blur(.4px)':'');
    b._x=0;b._y=0;
    b.addEventListener('animationiteration',function(e){if(e.animationName==='rise')b.style.left=Math.random()*94+'%';});
    b.addEventListener('click',function(){var r=b.getBoundingClientRect();popFx(r.left+r.width/2,r.top+r.height/2);b.remove();setTimeout(function(){bub(false,false);},800);});
    sky.appendChild(b);bubs.push(b);
  }
  if(!calm){
    for(var i=0;i<16;i++)bub(true,false);
    for(var j=0;j<8;j++)bub(true,true);
    if(window.matchMedia('(pointer: fine)').matches){
      var px=-999,py=-999;
      window.addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;},{passive:true});
      window.addEventListener('blur',function(){px=py=-999;});
      (function tick(){
        for(var k=bubs.length-1;k>=0;k--){
          var b=bubs[k];if(!b.isConnected){bubs.splice(k,1);continue;}if(b.style.pointerEvents==='none')continue;
          var r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=cx-px,dy=cy-py,dist=Math.sqrt(dx*dx+dy*dy)||1,R=130,tx=0,ty=0;
          if(dist<R){var f=1-dist/R;tx=dx/dist*f*70;ty=dy/dist*f*70;}
          b._x+=(tx-b._x)*.12;b._y+=(ty-b._y)*.12;
          if(Math.abs(b._x)>.05||Math.abs(b._y)>.05)b.style.translate=b._x.toFixed(1)+'px '+b._y.toFixed(1)+'px';
        }
        requestAnimationFrame(tick);
      })();
    }
  }
})();


/* ===== part 2 ===== */
(function(){
  var $=function(s,r){return(r||document).querySelector(s);},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s));};
  var calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches,fine=window.matchMedia('(pointer: fine)').matches,body=document.body;

  /* 1. dive-in intro, once per visit */
  var dive=$('#dive');function ready(){body.classList.add('ready');}
  var seen=false;try{seen=sessionStorage.getItem('fdr-dived')==='1';}catch(e){}
  if(calm||seen||location.hash.length>1){dive.remove();ready();}
  else{
    for(var i=0;i<20;i++){var s=document.createElement('span'),z=14+Math.random()*58;s.className='ib';
      s.style.cssText='width:'+z+'px;height:'+z+'px;left:'+(Math.random()*96)+'%;--t:'+(2.2+Math.random()*2).toFixed(1)+'s;--dl:-'+(Math.random()*3).toFixed(1)+'s';dive.appendChild(s);}
    var gone=false;
    var leave=function(){if(gone)return;gone=true;try{sessionStorage.setItem('fdr-dived','1');}catch(e){}dive.classList.add('leave');setTimeout(ready,500);setTimeout(function(){dive.remove();},1700);};
    setTimeout(leave,1900);dive.addEventListener('click',leave);
  }

  /* 2. water ripples under the pointer */
  var cv=$('#ripples'),cx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),rip=[],run=false;
  function size(){W=window.innerWidth;H=window.innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';cx.setTransform(dpr,0,0,dpr,0,0);}
  size();window.addEventListener('resize',size);
  function draw(){
    cx.clearRect(0,0,W,H);
    for(var i=rip.length-1;i>=0;i--){var p=rip[i];p.r+=p.sp;var t=p.r/p.m;if(t>=1){rip.splice(i,1);continue;}
      var al=p.a*(1-t);cx.lineWidth=p.w;
      cx.strokeStyle='rgba(255,255,255,'+al.toFixed(3)+')';cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.stroke();
      cx.strokeStyle='rgba(170,230,255,'+(al*.7).toFixed(3)+')';cx.beginPath();cx.arc(p.x,p.y,p.r*.62,0,6.283);cx.stroke();}
    if(rip.length)requestAnimationFrame(draw);else{run=false;cx.clearRect(0,0,W,H);}
  }
  function ripple(x,y,big){rip.push({x:x,y:y,r:big?6:3,m:big?150:70,a:big?.75:.45,sp:big?3.2:1.9,w:big?2.2:1.4});if(!run){run=true;requestAnimationFrame(draw);}}
  var lx=-99,ly=-99,lt=0;
  window.addEventListener('pointermove',function(e){if(calm||!fine)return;if(e.target.closest&&e.target.closest('#shell'))return;var d=Math.hypot(e.clientX-lx,e.clientY-ly),n=performance.now();if(d>34&&n-lt>60){ripple(e.clientX,e.clientY,false);lx=e.clientX;ly=e.clientY;lt=n;}},{passive:true});
  window.addEventListener('pointerdown',function(e){if(calm)return;if(e.target.closest&&e.target.closest('#shell'))return;ripple(e.clientX,e.clientY,true);});

  /* 3. bubble cursor, bubble trail, parallax */
  if(fine&&!calm){
    var cur=$('#cur'),tx=-99,ty=-99,x=-99,y=-99,shown=false,lastT=0,trailN=0,rays=$('.rays'),waves=$('.waves');
    window.addEventListener('pointermove',function(e){
      tx=e.clientX;ty=e.clientY;if(!shown){shown=true;cur.style.opacity=1;x=tx;y=ty;}
      cur.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,.card')));
      var n=performance.now();
      if(n-lastT>55&&trailN<16&&!(e.target.closest&&e.target.closest('#shell'))){lastT=n;trailN++;var t=document.createElement('i'),z=4+Math.random()*8;t.className='trail';
        t.style.cssText='left:'+e.clientX+'px;top:'+e.clientY+'px;width:'+z+'px;height:'+z+'px;--tx:'+Math.round(Math.random()*30-15)+'px';
        document.body.appendChild(t);setTimeout(function(){t.remove();trailN--;},1200);}
      var px=e.clientX/window.innerWidth-.5;rays.style.translate=(px*-36).toFixed(1)+'px 0';waves.style.translate=(px*22).toFixed(1)+'px 0';
    },{passive:true});
    document.documentElement.addEventListener('mouseleave',function(){cur.style.opacity=0;shown=false;});
    (function f(){
      var dx=tx-x,dy=ty-y;x+=dx*.18;y+=dy*.18;
      var sp=Math.min(Math.sqrt(dx*dx+dy*dy)/60,1),an=Math.atan2(dy,dx)*57.3;
      cur.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) translate(-50%,-50%) rotate('+an.toFixed(0)+'deg) scale('+(1+sp*.4).toFixed(2)+','+(1-sp*.18).toFixed(2)+')';
      requestAnimationFrame(f);
    })();
    window.addEventListener('pointerdown',function(){cur.classList.add('press');});
    window.addEventListener('pointerup',function(){cur.classList.remove('press');});

    /* 4. glass cards tilt, magnetic buttons */
    $$('.card:not(.wip):not(.cbox):not(.hang):not(.axc)').forEach(function(c){
      c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
        c.style.transform='perspective(900px) rotateY('+((px-.5)*10).toFixed(1)+'deg) rotateX('+((.5-py)*10).toFixed(1)+'deg) translateY(-3px)';
        c.style.setProperty('--gx',(px*100).toFixed(0)+'%');c.style.setProperty('--gy',(py*100).toFixed(0)+'%');});
      c.addEventListener('pointerleave',function(){c.style.transform='';});
    });
    $$('.btn').forEach(function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-(r.left+r.width/2))*.22).toFixed(1)+'px '+((e.clientY-(r.top+r.height/2))*.3).toFixed(1)+'px';});
      b.addEventListener('pointerleave',function(){b.style.translate='';});
    });
  }

  /* 6. plunge transition between pages */
  var sw=$('#sweep');
  document.addEventListener('fdr:nav',function(){
    if(calm)return;var m=$('main');m.classList.remove('plunge');void m.offsetWidth;m.classList.add('plunge');setTimeout(function(){m.classList.remove('plunge');},700);
    for(var i=0;i<26;i++){var s=document.createElement('span'),z=22+Math.random()*80;s.className='sw';
      s.style.cssText='width:'+z+'px;height:'+z+'px;left:'+(Math.random()*98)+'%;--t:'+(.9+Math.random()*.7).toFixed(2)+'s;--dl:'+(Math.random()*.3).toFixed(2)+'s';
      sw.appendChild(s);(function(el){setTimeout(function(){el.remove();},2000);})(s);}
  });

  /* 7. soft ocean ambience with the note button */
  var amb=null;
  function ambient(on){
    try{
      if(!on){if(amb){var a=amb;amb=null;a.g.gain.linearRampToValueAtTime(0,a.c.currentTime+.6);setTimeout(function(){try{a.src.stop();a.o.stop();a.c.close();}catch(e){}},800);}return;}
      if(amb)return;
      var c=new(window.AudioContext||window.webkitAudioContext)(),len=c.sampleRate*3,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0),last=0;
      for(var i=0;i<len;i++){var w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5;}
      var src=c.createBufferSource();src.buffer=buf;src.loop=true;
      var lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;
      var g=c.createGain();g.gain.value=0;var o=c.createOscillator();o.frequency.value=.11;var og=c.createGain();og.gain.value=.018;
      o.connect(og);og.connect(g.gain);src.connect(lp);lp.connect(g);g.connect(c.destination);src.start();o.start();
      g.gain.linearRampToValueAtTime(.05,c.currentTime+1.2);amb={c:c,g:g,src:src,o:o};
    }catch(e){}
  }
  $('#snd').addEventListener('click',function(){ambient(this.getAttribute('aria-pressed')==='true');});
})();


/* ===== part 3 ===== */
(function(){var ids=['about','achievements','family'];function upd(){document.documentElement.classList.toggle('fit',ids.some(function(i){var e=document.getElementById(i);return e&&e.classList.contains('active');}));}ids.forEach(function(i){var e=document.getElementById(i);if(e)new MutationObserver(upd).observe(e,{attributes:true,attributeFilter:['class']});});upd();})();
(function(){var m=document.querySelector('.me'),a=document.getElementById('abimg');if(m&&a)a.src=m.src;})();


/* ===== part 4 ===== */
(function(){
  var calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var order=['home','about','achievements','family'];
  var labels={home:'Homepage',about:'Personal Information',achievements:'Achievements',family:'Family and Friends'};
  order.forEach(function(id,i){
    var v=document.getElementById(id),d=document.createElement('div'),p=order[i-1],n=order[i+1];
    d.className='pn';
    var dots=order.map(function(o){return '<a href="#'+o+'" title="'+labels[o]+'" aria-label="'+labels[o]+'"'+(o===id?' class="cur" aria-current="page"':'')+'></a>';}).join('');
    d.innerHTML=(p?'<a class="pill glass" href="#'+p+'" aria-label="Previous: '+labels[p]+'">&#9664; Prev</a>':'<span class="pill glass off">&#9664; Prev</span>')+'<span class="pdots">'+dots+'</span>'+(n?'<a class="pill glass" href="#'+n+'" aria-label="Next: '+labels[n]+'">Next &#9654;</a>':'<span class="pill glass off">Next &#9654;</span>');
    v.appendChild(d);
  });
  var rv=[].slice.call(document.querySelectorAll('.rv'));
  document.querySelectorAll('.view').forEach(function(v){[].slice.call(v.querySelectorAll('.rv')).forEach(function(el,i){el.style.transitionDelay=(i*90)+'ms';});});
  function done(el){el.classList.add('in');setTimeout(function(){el.style.transitionDelay='';},1300);}
  if('IntersectionObserver' in window&&!calm){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){done(en.target);io.unobserve(en.target);}});},{threshold:.12});
    rv.forEach(function(el){io.observe(el);});
  }else{rv.forEach(function(el){el.classList.add('in');});}
  var f=document.getElementById('bottle');
  if(f)f.addEventListener('submit',function(e){
    e.preventDefault();
    var n=f.elements.n.value.trim(),m=f.elements.m.value.trim(),st=document.getElementById('bstat');
    if(!m){st.textContent='Please write a message first.';f.elements.m.focus();return;}
    st.textContent='Opening your email app\u2026';
    var subject='Message from '+(n||'a visitor')+' (portfolio)',body=m+(n?'\n\n\u2014 '+n:'');
    window.location.href='mailto:rillorazafd.13@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();


/* ===== part 5 ===== */
(function(){
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.copy');if(!b)return;
    var t=b.dataset.copy;
    function ok(){b.textContent='Copied!';b.classList.add('ok');setTimeout(function(){b.textContent='Copy';b.classList.remove('ok');},1500);}
    function fb(){var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');ok();}catch(x){}ta.remove();}
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(ok,fb);}else{fb();}
  });
})();


/* ===== part 6 ===== */
(function(){
  var n=new Date(),Y=2008,M=5,D=5,t0=new Date(n.getFullYear(),n.getMonth(),n.getDate());
  var age=n.getFullYear()-Y-((n.getMonth()<M||(n.getMonth()===M&&n.getDate()<D))?1:0);
  var next=new Date(n.getFullYear(),M,D);if(next<t0)next=new Date(n.getFullYear()+1,M,D);
  var prev=new Date(next.getFullYear()-1,M,D);
  var days=Math.round((next-t0)/864e5),span=Math.round((next-prev)/864e5),frac=Math.min(Math.max((span-days)/span,0),1);
  var a=document.getElementById('abAge');if(a){a.dataset.n=age;a.textContent=age;}
  var b=document.getElementById('abBd');if(b)b.textContent=days===0?'Happy birthday!':'Turning '+(age+1)+' in '+days+' day'+(days===1?'':'s');
  var r=document.getElementById('abRing');if(r)r.style.strokeDashoffset=(100-frac*100).toFixed(1);
})();


/* ===== part 7 ===== */
(function(){
  var calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var view=document.getElementById('achievements');
  if(view){var tg=function(){document.documentElement.classList.toggle('noscroll',view.classList.contains('active'));};new MutationObserver(tg).observe(view,{attributes:true,attributeFilter:['class']});tg();}
  /* ===== YOUR ACHIEVEMENTS: edit this list =====
     k    icon: honor | star | pen | tent | cup | book | medal
     t    award title
     img  proof photo: a file path such as 'assets/images/awards/honors-2020.jpg' or a data: URI. Leave '' until you have it.
     To add an award, copy one { ... } line inside the right school.
     Each school shows its awards as a numbered list, with the matching proof photos below.
     The page never scrolls: when a school has more awards than fit, the next set flips in by itself. */
  var D=[
    {lvl:'Elementary',logo:'assets/images/logos/elementary.png',school:'Alzate Village Elementary School',yr:'2020',aw:[
      {k:'honor',t:'With Honors',img:'assets/images/awards/elementary-with-honors.jpg',pos:'50% 24%'},
      {k:'tent',t:'Girl Scout of the Philippines',img:'assets/images/awards/elementary-girl-scout-of-the-philippines.jpg',pos:'50% 55%'},
      {k:'pen',t:"Division Journalist's Congress Participant",img:'assets/images/awards/elementary-division-journalist-s-congress-participant.jpg',pos:'50% 42%'},
      {k:'pen',t:'District Press-Conference Participant',img:'assets/images/awards/elementary-district-press-conference-participant.jpg',pos:'50% 32%'},
      {k:'cup',t:'District Athletic Meet Participant',img:'assets/images/awards/elementary-district-athletic-meet-participant.jpg',pos:'50% 30%'},
      {k:'star',t:'Leadership Awardee',img:'assets/images/awards/elementary-with-honors.jpg',pos:'50% 24%'}]},
    {lvl:'Junior high school',logo:'assets/images/logos/junior-high-school.png',school:'Nampicuan Christian Academy',yr:'2024',aw:[
      {k:'honor',t:'With Honors',img:'assets/images/awards/junior-high-school-with-honors.jpg',pos:'50% 45%'},
      {k:'star',t:'Leadership Awardee',img:'assets/images/awards/junior-high-school-leadership-awardee.jpg',pos:'50% 50%'},
      {k:'cup',t:'Athlete of the Year',img:'assets/images/awards/junior-high-school-leadership-awardee.jpg',pos:'50% 50%'},
      {k:'book',t:'Best in TLE',img:'assets/images/awards/junior-high-school-best-in-tle.jpg',pos:'50% 50%'},
      {k:'pen',t:'Nepessa Press-Conference Participant',img:'assets/images/awards/junior-high-school-nepessa-press-conference-participant.jpg',pos:'50% 55%'},
      {k:'cup',t:'District Athletic Meet Participant',img:'assets/images/awards/junior-high-school-district-athletic-meet-participant.jpg',pos:'50% 42%'},
      {k:'cup',t:'CD-1 Meet Participant',img:'assets/images/awards/junior-high-school-cd-1-meet-participant.jpg',pos:'50% 45%'},
      {k:'cup',t:'Provincial Meet Participant',img:'assets/images/awards/junior-high-school-provincial-meet-participant.jpg',pos:'50% 40%'},
      {k:'medal',t:'Poomsae Taekwondo - Bronze Medalist',img:'assets/images/awards/junior-high-school-provincial-meet-participant.jpg',pos:'50% 40%'},
      {k:'medal',t:'Taekwondo - Low Yellow Belt',img:'assets/images/awards/junior-high-school-taekwondo-low-yellow-belt.jpg',fit:'contain'},
      {k:'star',t:'Loyalty Award',img:'assets/images/awards/junior-high-school-loyalty-award.jpg',pos:'50% 50%'}]},
    {lvl:'Senior high school',logo:'assets/images/logos/senior-high-school.png',school:'Anao National High School',yr:'2026',aw:[
      {k:'honor',t:'With High Honors',img:'assets/images/awards/senior-high-school-with-high-honors.jpg',pos:'50% 55%'},
      {k:'star',t:'Leadership Awardee',img:'assets/images/awards/senior-high-school-leadership-awardee.jpg',pos:'50% 42%'},
      {k:'tent',t:'Boy Scout of the Philippines',img:'assets/images/awards/senior-high-school-boy-scout-of-the-philippines.jpg',pos:'50% 55%'},
      {k:'book',t:'Best in Research',img:'assets/images/awards/senior-high-school-best-in-research.jpg',pos:'50% 50%'},
      {k:'book',t:'Best in Work Immersion',img:'assets/images/awards/senior-high-school-best-in-research.jpg',pos:'50% 50%'},
      {k:'tent',t:'33rd Asia Pacific Regional Scout Jamboree Participant',img:'assets/images/awards/senior-high-school-33rd-asia-pacific-regional-scout-jamboree-participant.jpg',pos:'50% 80%'},
      {k:'pen',t:'District Press-Conference Participant',img:'assets/images/awards/senior-high-school-district-press-conference-participant.jpg',pos:'50% 40%'},
      {k:'pen',t:'Division Press-Conference Participant',img:'assets/images/awards/senior-high-school-division-press-conference-participant.jpg',pos:'50% 50%'},
      {k:'pen',t:'Essay Writing (Filipino) - 1st Place',img:'assets/images/awards/senior-high-school-essay-writing-filipino-1st-place.jpg',pos:'50% 52%'},
      {k:'medal',t:'Lantern Making - Champion (2024)',img:'assets/images/awards/senior-high-school-lantern-making-champion-2024.jpg',pos:'50% 62%'},
      {k:'medal',t:'Lantern Making - 1st Runner up (2025)',img:'assets/images/awards/senior-high-school-lantern-making-1st-runner-up-2025.jpg',pos:'50% 50%'},
      {k:'medal',t:'Zumba Dance Contest - Champion',img:'assets/images/awards/senior-high-school-zumba-dance-contest-champion.jpg',pos:'50% 58%'},
      {k:'medal',t:'La Jota Anaoena - 1st Runner up',img:'assets/images/awards/senior-high-school-la-jota-anaoena-1st-runner-up.jpg',pos:'50% 62%'}]}
  ];
  var GRAD=[
    {k:'dc',lvl:'Daycare',school:'Ambassador Expansion East Day Care Center',img:'assets/images/graduation/daycare.jpg',th:'assets/images/graduation/daycare-thumb.jpg'},
    {k:'kg',lvl:'Kindergarten',school:'P. Gomez Elementary School',img:'assets/images/graduation/kindergarten.jpg',th:'assets/images/graduation/kindergarten-thumb.jpg'},
    {k:'el',lvl:'Elementary',school:D[0].school,img:'assets/images/graduation/elementary.jpg',th:'assets/images/graduation/elementary-thumb.jpg'},
    {k:'jh',lvl:'Junior high school',school:D[1].school,img:'assets/images/graduation/junior-high-school.jpg',th:'assets/images/graduation/junior-high-school-thumb.jpg'},
    {k:'sh',lvl:'Senior high school',school:D[2].school,img:'assets/images/graduation/senior-high-school.jpg',th:'assets/images/graduation/senior-high-school-thumb.jpg'}
  ];
  var OFF=[],ALL=[];(function(){var n=0;D.forEach(function(d){OFF.push(n);n+=d.aw.length;d.aw.forEach(function(a){ALL.push({a:a,d:d});});});})();
  var ICON={
    honor:'<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7 21l5-3 5 3-2-7.5"/>',
    star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    pen:'<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1zM14 7l3 3"/>',
    tent:'<path d="M3 20L12 4l9 16H3zM12 20v-7"/>',
    cup:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/>',
    book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13"/>',
    medal:'<circle cx="12" cy="14" r="5"/><path d="M8.5 3h7l-2 6M8.5 3l2 6"/>'
  };
  var COL={honor:'#b6f0dc',star:'#ffd9a8',pen:'#cdb8ff',tent:'#8fd8f5',cup:'#ffb9dc',book:'#8fd8f5',medal:'#ffd9a8'};
  var cols=[].slice.call(document.querySelectorAll('.axc'));
  if(!cols.length)return;
  var st=cols.map(function(){return {page:0,per:1,pages:1,w:0,h:0,hold:false};});
  function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
  function svg(k,z){return '<svg viewBox="0 0 24 24" width="'+z+'" height="'+z+'" fill="none" stroke="#0b3050" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICON[k]||ICON.medal)+'</svg>';}
  function col(k){return COL[k]||'#8fd8f5';}
  var stats=document.getElementById('axs'),total=D.reduce(function(n,d){return n+d.aw.length;},0);
  if(stats)stats.innerHTML='<span><b>'+D.length+'</b> schools</span><span><b>'+total+'</b> awards</span>';
  cols.forEach(function(c,i){
    var d=D[i];if(!d)return;
    c.querySelector('.tag').textContent=d.lvl;c.querySelector('h3').innerHTML=(d.logo?'<img class="axlogo" src="'+d.logo+'" alt="">':'')+'<span>'+esc(d.school)+'</span>';
    c.querySelector('.muted').textContent='Completed '+d.yr+' \u00b7 '+d.aw.length+' award'+(d.aw.length===1?'':'s');
    c.addEventListener('pointerenter',function(){st[i].hold=true;});c.addEventListener('pointerleave',function(){st[i].hold=false;});
  });
  function thumb(a,num){
    var badge='<b class="pfn">'+num+'</b>';
    if(a.img)return '<span class="pfth"><img src="'+esc(a.img)+'" alt="Proof photo: '+esc(a.t)+'" loading="lazy" decoding="async">'+badge+'</span>';
    return '<span class="pfth empty"><span class="phi">'+svg(a.k,40)+'</span>'+badge+'</span>';
  }
  /* how many awards fit in this school's list without scrolling (photos now live in the bottom strip) */
  function fit(i){
    var c=cols[i],s=st[i],n=D[i].aw.length;
    if(!c.clientWidth||!c.clientHeight||!n)return false;
    var cs=getComputedStyle(c),padY=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom),gp=parseFloat(cs.rowGap)||11;
    var body=c.clientHeight-padY-c.querySelector('.axch').offsetHeight-gp;
    var list=c.querySelector('.axlist'),probe=document.createElement('li');
    probe.innerHTML='<b>1</b><span class="lt">X</span>';list.innerHTML='';list.appendChild(probe);
    var lg=parseFloat(getComputedStyle(list).rowGap)||5,LH=probe.offsetHeight+lg;list.innerHTML='';
    s.per=n;
    s.pages=Math.ceil(n/s.per);s.page=Math.min(s.page,s.pages-1);
    s.w=c.clientWidth;s.h=c.clientHeight;return true;
  }
  function renderCol(i,mode){
    var d=D[i],c=cols[i],s=st[i],list=c.querySelector('.axlist');
    if(!d||!fit(i))return;
    var from=s.page*s.per,items=d.aw.slice(from,from+s.per);
    function li(a,k){return '<li data-g="'+(OFF[i]+from+k)+'" tabindex="0" role="button" title="View photo" style="--c:'+col(a.k)+'"><b>'+(from+k+1)+'</b><span class="lt">'+esc(a.t)+'</span><i>'+svg(a.k,14)+'</i></li>';}
    var two=items.length>6,half=Math.ceil(items.length/2);
    list.classList.toggle('two',two);
    list.innerHTML=two?'<div class="axcol">'+items.slice(0,half).map(li).join('')+'</div><div class="axcol">'+items.slice(half).map(function(a,k){return li(a,k+half);}).join('')+'</div>'
                      :items.map(li).join('');
    (function(){var fs=15,mn=8;
      list.style.setProperty('--fs',fs+'px');
      var over=function(){return list.scrollHeight>list.clientHeight+1||[].slice.call(list.querySelectorAll('.axcol')).some(function(q){return q.scrollHeight>q.clientHeight+1;});};
      while(fs>mn&&over()){fs-=.5;list.style.setProperty('--fs',fs+'px');}})();
    c.querySelector('.axdots').innerHTML=s.pages>1?Array.apply(null,Array(s.pages)).map(function(_,p){return '<i'+(p===s.page?' class="on"':'')+'></i>';}).join(''):'';
    if(mode==='swap'&&!calm){list.classList.remove('axsw');void list.offsetWidth;list.classList.add('axsw');}
  }
  /* bottom strip: every proof photo from every school, sliding on its own, looping seamlessly */
  function buildRail(){
    var track=document.getElementById('axtrack');if(!track)return;
    var tiles=[];
    D.forEach(function(d){d.aw.forEach(function(a){
      var ph=a.img?'<span class="rph'+(a.fit==='contain'?' cont':'')+'"><img style="'+(a.fit==='contain'?'object-fit:contain;':'')+'object-position:'+(a.pos||'50% 50%')+'" src="'+esc(a.img)+'" alt="Proof photo: '+esc(a.t)+'" loading="lazy" decoding="async"></span>'
                  :'<span class="rph empty"><span class="phi">'+svg(a.k,40)+'</span></span>';
      tiles.push('<div class="rt" data-g="'+tiles.length+'" tabindex="0" role="button" aria-label="Open photo: '+esc(a.t)+'" style="--c:'+col(a.k)+'">'+ph+'<div class="rcap"><i>'+svg(a.k,12)+'</i><span>'+esc(a.t)+'</span></div><div class="rsc">'+esc(d.lvl)+' &middot; '+esc(d.yr)+'</div></div>');
    });});
    var set=tiles.join('');
    track.innerHTML=set+set.replace(/tabindex="0"/g,'tabindex="-1" aria-hidden="true"');
    /* constant slide speed (75 px/s = 1.5x the old pace), whatever the tile size or screen */
    function speed(){var w=track.scrollWidth/2;if(w>0)track.style.setProperty('--dur',(w/75).toFixed(1)+'s');}
    speed();window.addEventListener('resize',speed);setTimeout(speed,300);setTimeout(speed,1200);
    [].slice.call(track.querySelectorAll('.rph img')).forEach(function(im){
      im.addEventListener('error',function(){var p=im.parentNode;p.className='rph empty';p.innerHTML='<span class="phi">'+svg('medal',40)+'</span>';});
    });
    var rail=document.getElementById('axrail');
    if(rail){rail.addEventListener('touchstart',function(){rail.classList.add('hold');},{passive:true});
      ['touchend','touchcancel'].forEach(function(e){rail.addEventListener(e,function(){setTimeout(function(){rail.classList.remove('hold');},1500);},{passive:true});});}
  }
  buildRail();

  /* ---------- school journey: every school in order, daycare -> college ---------- */
  (function(){
    var host=document.getElementById('axjr');if(!host)return;
    var SCH=[
      {lv:'Daycare',nm:'Ambassador Day Care Center',full:'Ambassador Expansion East Day Care Center',logo:'assets/images/logos/daycare.png',gi:0},
      {lv:'Kindergarten',gi:1,nm:'P. Gomez Elem. School',full:'P. Gomez Elementary School',logo:'assets/images/logos/kindergarten.png'},
      {lv:'Elementary',gi:2,nm:'Alzate Village Elem. School',full:D[0].school,logo:D[0].logo},
      {lv:'Junior high',gi:3,nm:D[1].school,full:D[1].school,logo:D[1].logo},
      {lv:'Senior high',gi:4,nm:D[2].school,full:D[2].school,logo:D[2].logo},
      {lv:'College \u00b7 Now',full:'University of the Cordilleras',nm:'University of the Cordilleras',logo:'assets/images/logos/college-now.png',now:true}
    ];
    host.innerHTML=SCH.map(function(x){
      return '<div class="jc'+(x.now?' now':'')+'" title="'+esc((x.full||x.nm)+' \u2013 '+x.lv)+'">'
        +(function(){var l=x.logo?'<img class="jl" src="'+x.logo+'" alt="">':'<span class="jl blank" aria-hidden="true"></span>';
          return x.gi===undefined?l:'<button type="button" class="jlw" data-gr="'+x.gi+'" title="See my graduation photo" aria-label="See my graduation photo - '+esc(x.full||x.nm)+'">'+l+'<img class="gp" src="'+GRAD[x.gi].th+'" alt=""></button>';})()
        +'<span class="jt"><i>'+esc(x.lv)+'</i><b>'+esc(x.nm)+'</b></span></div>';
    }).join('');
  })();

  /* ---------- photo viewer: click a photo or an award row ---------- */
  (function(){
    var box=document.createElement('div');box.className='axlb';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Award photo viewer');box.hidden=true;
    box.innerHTML='<div class="lbp"><button class="lbx" type="button" aria-label="Close">&times;</button>'
      +'<button class="lbn lbprev" type="button" aria-label="Previous photo">&#8249;</button>'
      +'<div class="lbimg"></div>'
      +'<button class="lbn lbnext" type="button" aria-label="Next photo">&#8250;</button>'
      +'<div class="lbcap"><span class="lbchip"></span><div class="lbtx"><b class="lbt"></b><span class="lbs"></span></div><span class="lbc"></span></div></div>';
    document.body.appendChild(box);
    var img=box.querySelector('.lbimg'),chip=box.querySelector('.lbchip'),tt=box.querySelector('.lbt'),ss=box.querySelector('.lbs'),cc=box.querySelector('.lbc'),LST=ALL,cur=0,opener=null,rail=document.getElementById('axrail');
    function show(g){
      cur=(g+LST.length)%LST.length;var o=LST[cur],a=o.a;
      img.innerHTML=a.img?'<img src="'+esc(a.img)+'" alt="Proof photo: '+esc(a.t)+'">':'<div class="lbph" style="--c:'+col(a.k)+'">'+svg(a.k,90)+'<small>Photo coming soon</small></div>';
      chip.style.setProperty('--c',col(a.k));chip.innerHTML=svg(a.k,18);
      tt.textContent=a.t;ss.textContent=[o.d.school,o.d.lvl,o.d.yr].filter(Boolean).join(' \u00b7 ');cc.textContent=(cur+1)+' / '+LST.length;
      box.classList.remove('pop');void box.offsetWidth;box.classList.add('pop');
    }
    function open(g,from,list){opener=from||null;LST=list||ALL;show(g);box.hidden=false;document.documentElement.classList.add('lbopen');if(rail)rail.classList.add('hold');box.querySelector('.lbx').focus();}
    function close(){box.hidden=true;document.documentElement.classList.remove('lbopen');if(rail)rail.classList.remove('hold');if(opener&&opener.focus)try{opener.focus({preventScroll:true});}catch(e){}}
    box.addEventListener('click',function(e){
      if(e.target===box||e.target.closest('.lbx'))close();
      else if(e.target.closest('.lbprev'))show(cur-1);
      else if(e.target.closest('.lbnext'))show(cur+1);
    });
    document.addEventListener('keydown',function(e){
      if(box.hidden)return;
      if(e.key==='Escape'){e.stopPropagation();close();}
      else if(e.key==='ArrowLeft'){e.stopPropagation();e.preventDefault();show(cur-1);}
      else if(e.key==='ArrowRight'){e.stopPropagation();e.preventDefault();show(cur+1);}
      else if(e.key==='Tab'){var f=[].slice.call(box.querySelectorAll('button'));var i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus();}
    },true);
    var tx=null;
    box.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
    box.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1));},{passive:true});
    function pick(e){
      var el=e.target.closest('.rt[data-g],.axlist li[data-g]');if(!el)return false;
      open(parseInt(el.getAttribute('data-g'),10),el);return true;
    }
    var GL=GRAD.map(function(g){return {a:{img:g.img,t:'Graduation photo',k:'honor'},d:{school:g.school,lvl:g.lvl,yr:''}};});
    document.addEventListener('click',function(e){
      var gb=e.target.closest&&e.target.closest('[data-gr]');
      if(gb){e.preventDefault();open(parseInt(gb.getAttribute('data-gr'),10),gb,GL);return;}
      pick(e);
    });
    document.addEventListener('keydown',function(e){
      if(!box.hidden||(e.key!=='Enter'&&e.key!==' '))return;
      var el=e.target.closest&&e.target.closest('.rt[data-g],.axlist li[data-g]');
      if(el){e.preventDefault();open(parseInt(el.getAttribute('data-g'),10),el);}
    });
  })();

  function renderAll(mode){cols.forEach(function(_,i){renderCol(i,mode);});}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){renderAll(false);});
  setTimeout(function(){renderAll(false);},900);
  if('ResizeObserver' in window){
    cols.forEach(function(c,i){new ResizeObserver(function(){if(c.clientWidth&&(c.clientWidth!==st[i].w||c.clientHeight!==st[i].h))renderCol(i,false);}).observe(c);});
  }else window.addEventListener('resize',function(){renderAll(false);});
  var was=false;
  if(view)new MutationObserver(function(){
    var on=view.classList.contains('active');
    if(on&&!was){cols.forEach(function(_,i){st[i].page=0;});setTimeout(function(){renderAll('swap');},80);}
    was=on;
  }).observe(view,{attributes:true,attributeFilter:['class']});
  if(view&&view.classList.contains('active')){was=true;requestAnimationFrame(function(){renderAll('swap');});}
  /* flip to the next set of awards for schools that have more than fit */
  setInterval(function(){
    if(document.hidden||!view||!view.classList.contains('active'))return;
    cols.forEach(function(_,i){var s=st[i];if(s.pages>1&&!s.hold){s.page=(s.page+1)%s.pages;renderCol(i,'swap');}});
  },6000);
})();
