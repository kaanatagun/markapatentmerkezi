/* Ana sayfa küresi: İstanbul'dan dünyaya tescil ağı */
(function(){
  var cv=document.getElementById('globe'); if(!cv) return;
  var ctx=cv.getContext('2d'), lang=document.documentElement.lang||'tr';
  var N={tr:{ist:'İstanbul',US:'ABD',GB:'Birleşik Krallık',EU:'EUIPO',WIPO:'WIPO · Cenevre',AE:'BAE',CN:'Çin',JP:'Japonya',CA:'Kanada',RU:'Rusya',ZA:'Afrika',BR:'Brezilya'},
         en:{ist:'Istanbul',US:'USA',GB:'United Kingdom',EU:'EUIPO',WIPO:'WIPO · Geneva',AE:'UAE',CN:'China',JP:'Japan',CA:'Canada',RU:'Russia',ZA:'Africa',BR:'Brazil'},
         ar:{ist:'إسطنبول',US:'الولايات المتحدة',GB:'المملكة المتحدة',EU:'EUIPO',WIPO:'WIPO · جنيف',AE:'الإمارات',CN:'الصين',JP:'اليابان',CA:'كندا',RU:'روسيا',ZA:'أفريقيا',BR:'البرازيل'}}[lang]||{};
  var IST=[28.97,41.01];
  var DEST=[['US',[-77.05,38.8]],['GB',[-0.12,51.5]],['EU',[-0.48,38.35]],['WIPO',[6.14,46.2]],['AE',[55.27,25.2]],['CN',[116.4,39.9]],['JP',[139.7,35.7]],['CA',[-75.7,45.4]],['RU',[37.6,55.75]],['ZA',[28.04,-26.2]],['BR',[-47.9,-15.8]]];
  var land=null, dots=[], W=0, dpr=Math.min(window.devicePixelRatio||1,2);
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){var r=cv.getBoundingClientRect();W=r.width;cv.width=W*dpr;cv.height=W*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  size(); addEventListener('resize',size);
  function ready(){return window.d3&&window.topojson;}
  function load(){
    if(!ready()) return draw0();
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json').then(function(r){return r.json()}).then(function(t){
      land=topojson.feature(t,t.objects.land);
      // kara üzerinde nokta ızgarası (bir kez hesaplanır, parça parça)
      var pts=[],step=2.4;
      for(var lat=-58;lat<80;lat+=step){var n=Math.max(1,Math.round(360*Math.cos(lat*Math.PI/180)/step));for(var i=0;i<n;i++)pts.push([-180+i*360/n,lat]);}
      var k=0;(function chunk(){var end=Math.min(pts.length,k+900);for(;k<end;k++)if(d3.geoContains(land,pts[k]))dots.push(pts[k]);if(k<pts.length)setTimeout(chunk,0);})();
    }).catch(function(){});
    requestAnimationFrame(frame);
  }
  function draw0(){ /* yedek: d3 yoksa sade küre */
    var r=W/2-8;ctx.clearRect(0,0,W,W);var g=ctx.createRadialGradient(W*.4,W*.35,r*.1,W/2,W/2,r);g.addColorStop(0,'#2a3f6b');g.addColorStop(1,'#101b33');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(W/2,W/2,r,0,7);ctx.fill();ctx.strokeStyle='rgba(226,194,127,.35)';ctx.stroke();
  }
  var t0=performance.now();
  function frame(now){
    var t=reduce?0:(now-t0);
    var r=W/2-10, cx=W/2, cy=W/2;
    var lam=-30+38*Math.sin(t*0.00011), phi=-24;
    var proj=d3.geoOrthographic().scale(r).translate([cx,cy]).rotate([lam,phi]).clipAngle(90);
    var path=d3.geoPath(proj,ctx);
    ctx.clearRect(0,0,W,W);
    // hale
    var halo=ctx.createRadialGradient(cx,cy,r*.9,cx,cy,r*1.12);halo.addColorStop(0,'rgba(226,194,127,.16)');halo.addColorStop(1,'rgba(226,194,127,0)');
    ctx.fillStyle=halo;ctx.beginPath();ctx.arc(cx,cy,r*1.12,0,7);ctx.fill();
    // küre
    var g=ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.1,cx,cy,r);g.addColorStop(0,'#2b416e');g.addColorStop(.7,'#16254a');g.addColorStop(1,'#0d1730');
    ctx.fillStyle=g;ctx.beginPath();path({type:'Sphere'});ctx.fill();
    // enlem-boylam çizgileri
    ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=.6;ctx.beginPath();path(d3.geoGraticule10());ctx.stroke();
    // kara
    if(dots.length){
      ctx.fillStyle='rgba(226,194,127,.72)';var s=Math.max(1.2,W/380);
      for(var i=0;i<dots.length;i++){var d=dots[i];if(d3.geoDistance(d,[-lam,-phi])>1.55)continue;var p=proj(d);ctx.fillRect(p[0]-s/2,p[1]-s/2,s,s);}
    } else if(land){ctx.fillStyle='rgba(226,194,127,.18)';ctx.beginPath();path(land);ctx.fill();}
    // yaylar
    var center=[-lam,-phi];
    DEST.forEach(function(dd,i){
      var to=dd[1],ip=d3.geoInterpolate(IST,to),prog=reduce?1:((t*0.00018+i*.17)%1.6);
      var head=Math.min(1,prog),tail=Math.max(0,prog-.6);
      var line={type:'LineString',coordinates:[]};for(var k=0;k<=40;k++){var f=tail+(head-tail)*k/40;line.coordinates.push(ip(f));}
      ctx.strokeStyle='rgba(226,194,127,.75)';ctx.lineWidth=1.3;ctx.beginPath();path(line);ctx.stroke();
      if(d3.geoDistance(to,center)<1.5){var p=proj(to);ctx.fillStyle='#e2c27f';ctx.beginPath();ctx.arc(p[0],p[1],2.6,0,7);ctx.fill();
        if(W>280){ctx.font='500 '+Math.max(11,Math.round(W/44))+'px Inter, sans-serif';ctx.fillStyle='rgba(230,234,242,.85)';ctx.textAlign='left';ctx.fillText(N[dd[0]]||dd[0],p[0]+6,p[1]-6);}}
    });
    // İstanbul
    if(d3.geoDistance(IST,center)<1.5){var q=proj(IST),pulse=reduce?0:(t*0.0012)%1;
      ctx.strokeStyle='rgba(226,194,127,'+(1-pulse)+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(q[0],q[1],4+pulse*16,0,7);ctx.stroke();
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(q[0],q[1],4,0,7);ctx.fill();
      ctx.font='600 '+Math.max(12,Math.round(W/36))+'px Inter, sans-serif';ctx.fillStyle='#fff';ctx.fillText(N.ist||'İstanbul',q[0]+9,q[1]+4);}
    // kenar
    ctx.strokeStyle='rgba(226,194,127,.35)';ctx.lineWidth=1;ctx.beginPath();path({type:'Sphere'});ctx.stroke();
    if(!reduce||!land) requestAnimationFrame(frame);
  }
  if(ready()) load(); else { var tries=0,iv=setInterval(function(){if(ready()||++tries>40){clearInterval(iv);load();}},100); }
})();
