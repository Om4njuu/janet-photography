(function(){
  var canvas = document.getElementById('grain');
  var ctx = canvas.getContext('2d');
  function resize(){canvas.width = window.innerWidth; canvas.height = window.innerHeight;}
  resize();
  window.addEventListener('resize', resize);
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function drawGrain(){
    var w = canvas.width, h = canvas.height;
    var imageData = ctx.createImageData(w,h);
    var buffer = new Uint32Array(imageData.data.buffer);
    for(var i=0;i<buffer.length;i++){
      var v = (Math.random()*255)|0;
      buffer[i] = (255<<24) | (v<<16) | (v<<8) | v;
    }
    ctx.putImageData(imageData,0,0);
  }
  var last = 0;
  function loop(t){
    if(!reduceMotion){
      if(t - last > 90){ drawGrain(); last = t; }
      requestAnimationFrame(loop);
    }
  }
  if(reduceMotion){ drawGrain(); } else { requestAnimationFrame(loop); }

  var cursor = document.getElementById('cursor');
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    window.addEventListener('mousemove', function(e){
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, .work-item').forEach(function(el){
      el.addEventListener('mouseenter', function(){cursor.classList.add('grow');});
      el.addEventListener('mouseleave', function(){cursor.classList.remove('grow');});
    });
  }

  var heroFrame = document.getElementById('heroFrame');
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(y < window.innerHeight){
      heroFrame.style.transform = 'translateY(' + (y*0.18) + 'px) scale(' + (1 + y*0.0002) + ')';
    }
  }, {passive:true});

  var works = [
    {t:'Low Tide', n:'01', image:'images/2.jpg'},
    {t:'Nature', n:'02', image:'images/1.jpg'},
    {t:'Nightshade', n:'03', image:'images/5.jpg'},
    {t:'Concrete Bloom', n:'04', image:'images/6.jpg'},
    {t:'Quiet Hour', n:'05', image:'images/4.jpg'},
    {t:'Afterimage', n:'06', image:'images/3.jpg'}
  ];
  var grid = document.getElementById('workGrid');
  var palettes = [
    ['#3a3733','#171513'],
    ['#2e2b27','#0d0c0b'],
    ['#332f29','#111010'],
    ['#28241f','#0a0a09'],
    ['#37332d','#141311'],
    ['#2c2822','#0c0b0a']
  ];
  works.forEach(function(w, i){
    var pal = palettes[i % palettes.length];
    var item = document.createElement('div');
    item.className = 'work-item';
    var artwork = w.image
      ? '<img class="work-image" src="' + w.image + '" alt="' + w.t + '">' 
      : '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
          '<defs><radialGradient id="wg'+i+'" cx="'+(30+ (i*11)%40)+'%" cy="'+(20+(i*7)%30)+'%" r="80%">' +
            '<stop offset="0%" stop-color="'+pal[0]+'"/><stop offset="100%" stop-color="'+pal[1]+'"/>' +
          '</radialGradient></defs>' +
          '<rect width="400" height="500" fill="url(#wg'+i+')"/>' +
          '<ellipse cx="'+(150+ (i*23)%100)+'" cy="'+(150+(i*17)%80)+'" rx="90" ry="110" fill="#000" opacity="0.28"/>' +
          '<path d="M0 500 C 60 '+ (350 - (i*10)%60) +' 200 '+(300-(i*8)%50)+' 400 500 Z" fill="#000" opacity="0.35"/>' +
        '</svg>';
    item.innerHTML = artwork +
      '<div class="work-caption"><span class="n">' + w.n + '</span><span class="t">' + w.t + '</span></div>';
    grid.appendChild(item);
  });

  var revealEls = document.querySelectorAll('.reveal, .work-item');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  revealEls.forEach(function(el){ io.observe(el); });
})();