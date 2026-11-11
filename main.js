(function(){
  var header=document.querySelector('header'),bar=document.getElementById('progress');
  var grid=document.querySelector('.grid-bg'),o1=document.querySelector('.o1'),o2=document.querySelector('.o2'),seal=document.querySelector('.seal');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function onScroll(){
    var y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight;
    header.classList.toggle('solid',y>40);
    bar.style.width=(h>0?y/h*100:0)+'%';
    if(reduce)return;
    if(y<innerHeight*1.2){
      if(grid)grid.style.transform='translateY('+y*0.25+'px)';
      if(o1)o1.style.transform='translateY('+y*0.4+'px)';
      if(o2)o2.style.transform='translateY('+(-y*0.2)+'px)';
    }

  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // görünür olunca belirme
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  // sayaçlar
  var co=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;var el=e.target,t=+el.dataset.to,s=el.dataset.suffix||'',st=null;
    function step(ts){if(!st)st=ts;var p=Math.min((ts-st)/1400,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3))).toLocaleString('tr-TR')+s;if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);co.unobserve(el);
  })},{threshold:.6});
  document.querySelectorAll('[data-to]').forEach(function(el){co.observe(el)});

  // mobil menü
  var b=document.querySelector('.burger'),m=document.querySelector('.menu');
  b.addEventListener('click',function(){m.classList.toggle('open')});
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open')})});

  // gönderim sonrası teşekkür
  if(/tesekkurler|thanks/.test(location.search)){
    var f=document.querySelector('#sorgulama form');
    if(f)f.innerHTML='<h3 style="font-family:var(--serif);font-size:26px;color:var(--navy);margin-bottom:10px">'+(document.documentElement.lang==='en'?'Thank you!':'Teşekkürler!')+'</h3><p style="color:var(--muted)">'+(document.documentElement.lang==='en'?'Your request has reached us. We will get back to you shortly.':'Talebiniz bize ulaştı. En kısa sürede size dönüş yapacağız.')+'</p>';
  }

  // sorgulama sekmeleri
  var type=document.getElementById('qtype');
  document.querySelectorAll('.tab').forEach(function(t){
    t.addEventListener('click',function(){
      document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});
      t.classList.add('active');type.value=t.dataset.type;
      document.querySelectorAll('.only-design').forEach(function(d){d.style.display=t.dataset.type==='design'?'block':'none'});
      document.getElementById('qsubject').value=t.dataset.subject;
    });
  });
})();
