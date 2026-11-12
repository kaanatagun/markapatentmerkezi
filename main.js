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
    function step(ts){if(!st)st=ts;var p=Math.min((ts-st)/1400,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3))).toLocaleString(document.documentElement.lang==='tr'?'tr-TR':'en-US')+s;if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);co.unobserve(el);
  })},{threshold:.6});
  document.querySelectorAll('[data-to]').forEach(function(el){co.observe(el)});

  // mobil menü
  var b=document.querySelector('.burger'),m=document.querySelector('.menu');
  b.addEventListener('click',function(){m.classList.toggle('open')});
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open')})});

  // gönderim sonrası teşekkür
  if(/tesekkurler|thanks/.test(location.search)){
    var f=document.querySelector((location.hash==='#ik'?'#ik':'#sorgulama')+' form');
    var L=document.documentElement.lang,M={tr:['Teşekkürler!','Talebiniz bize ulaştı. En kısa sürede size dönüş yapacağız.'],en:['Thank you!','Your request has reached us. We will get back to you shortly.'],ar:['شكراً لك!','وصلنا طلبك، وسنعود إليك في أقرب وقت.']}[L]||['Teşekkürler!',''];
    if(f){f.innerHTML='<h3 style="font-family:var(--serif);font-size:26px;color:var(--navy);margin-bottom:10px">'+M[0]+'</h3><p style="color:var(--muted)">'+M[1]+'</p>';f=null}
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

/* WhatsApp ön formu: konu + ad soyad + telefon + e-posta, ardından WhatsApp mesajı */
(function(){
  var L=(document.documentElement.lang||'tr'),
  T={
   tr:{h:'WhatsApp ile bize ulaşın',p:'Birkaç bilgi bırakın, mesajınız hazır olarak WhatsApp\'a aktarılsın.',q:'Ne yapmak istiyorsunuz?',
       o:[['Marka tescili','Marka tescili almak istiyorum'],['Patent','Bir fikrim / buluşum var, patent almak istiyorum'],['Tasarım tescili','Bir görselim / tasarımım var, tasarım tescili almak istiyorum']],
       n:'Ad Soyad',t:'Telefon',e:'E-posta',b:'WhatsApp\'tan gönder',
       note:'Mesajınızı aldıktan sonra mesai saatleri içinde <b>25 dakika içinde</b> size ulaşıyoruz.',
       m:function(d){return 'Merhaba, size web sitenizden (markapatentmerkezi.com) ulaşıyorum.\n\nKonu: '+d.o+'\nAd Soyad: '+d.n+'\nTelefon: '+d.t+'\nE-posta: '+d.e}},
   en:{h:'Contact us on WhatsApp',p:'Leave a few details and your message will open ready in WhatsApp.',q:'What would you like to do?',
       o:[['Trademark registration','I want to register a trademark'],['Patent','I have an idea / invention and want a patent'],['Design registration','I have a visual / design and want design registration']],
       n:'Full name',t:'Phone',e:'Email',b:'Send via WhatsApp',
       note:'Once we receive your message, we contact you <b>within 25 minutes</b> during office hours.',
       m:function(d){return 'Hello, I am contacting you through your website (markapatentmerkezi.com).\n\nTopic: '+d.o+'\nName: '+d.n+'\nPhone: '+d.t+'\nEmail: '+d.e}},
   ar:{h:'تواصل معنا عبر واتساب',p:'اترك بعض المعلومات وستُفتح رسالتك جاهزة في واتساب.',q:'ماذا تريد أن تفعل؟',
       o:[['تسجيل علامة تجارية','أريد تسجيل علامة تجارية'],['براءة اختراع','لديّ فكرة / اختراع وأريد براءة اختراع'],['تسجيل تصميم','لديّ صورة / تصميم وأريد تسجيل التصميم']],
       n:'الاسم الكامل',t:'الهاتف',e:'البريد الإلكتروني',b:'أرسل عبر واتساب',
       note:'بعد استلام رسالتك، نتواصل معك <b>خلال 25 دقيقة</b> في ساعات العمل.',
       m:function(d){return 'مرحباً، أتواصل معكم من خلال موقعكم الإلكتروني (markapatentmerkezi.com).\n\nالموضوع: '+d.o+'\nالاسم: '+d.n+'\nالهاتف: '+d.t+'\nالبريد الإلكتروني: '+d.e}}
  }[L]||null;
  if(!T)return;
  var num=null;
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function(a){var m=a.href.match(/wa\.me\/(\d+)/);if(m)num=m[1];});
  if(!num)return;
  var opts=T.o.map(function(o,i){return '<label class="wa-opt"><input type="radio" name="wa_o" value="'+o[1]+'"'+(i===0?' checked':'')+'><span><b>'+o[0]+'</b><small>'+o[1]+'</small></span></label>'}).join('');
  var box=document.createElement('div');box.className='wa-modal';box.hidden=true;
  box.innerHTML='<div class="wa-back"></div><form class="wa-card" novalidate><button type="button" class="wa-x" aria-label="×">×</button><h3>'+T.h+'</h3><p class="wa-p">'+T.p+'</p><div class="wa-q">'+T.q+'</div><div class="wa-opts">'+opts+'</div>'+
   '<label>'+T.n+'<input name="n" required autocomplete="name"></label><label>'+T.t+'<input name="t" type="tel" required autocomplete="tel"></label><label>'+T.e+'<input name="e" type="email" required autocomplete="email"></label>'+
   '<button class="btn wa-send" type="submit">'+T.b+'</button><p class="wa-note">'+T.note+'</p></form>';
  document.body.appendChild(box);
  var f=box.querySelector('form');
  function open(e){e.preventDefault();box.hidden=false;document.body.style.overflow='hidden';setTimeout(function(){f.n.focus()},50);}
  function close(){box.hidden=true;document.body.style.overflow='';}
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="https://wa.me/"]');if(a)open(e);});
  box.querySelector('.wa-back').onclick=close;box.querySelector('.wa-x').onclick=close;
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!box.hidden)close();});
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;['n','t','e'].forEach(function(k){var i=f[k];var bad=!i.value.trim()||(k==='e'&&!/^\S+@\S+\.\S+$/.test(i.value));i.classList.toggle('bad',bad);if(bad)ok=false;});
    if(!ok)return;
    var d={o:f.querySelector('input[name=wa_o]:checked').value,n:f.n.value.trim(),t:f.t.value.trim(),e:f.e.value.trim()};
    var u='https://wa.me/'+num+'?text='+encodeURIComponent(T.m(d));if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))location.href=u;else window.open(u,'_blank','noopener');
    close();
  });
})();
