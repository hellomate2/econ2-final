(function(){
  var KEY="econ2-final-done";
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
  function save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
  var done=load();
  function paint(){
    document.querySelectorAll("[data-unit]").forEach(function(el){el.classList.toggle("done",!!done[el.getAttribute("data-unit")])});
    var all=document.querySelectorAll(".units .ucard").length, n=0;
    document.querySelectorAll(".units .ucard").forEach(function(c){if(done[c.getAttribute("data-unit")])n++});
    var bar=document.querySelector(".progress i"); if(bar&&all){bar.style.width=(100*n/all)+"%"}
    var lab=document.getElementById("prog-label"); if(lab&&all){lab.textContent=n+" of "+all+" units done"}
    var b=document.getElementById("mark-done"); if(b){var u=b.getAttribute("data-u");b.textContent=done[u]?"Done. Mark as not done":"Mark this unit as done";b.classList.toggle("primary",!done[u])}
  }
  var mb=document.getElementById("mark-done");
  if(mb){mb.addEventListener("click",function(){var u=mb.getAttribute("data-u");done[u]=!done[u];save(done);paint()})}
  paint();
  // reveal / hide all answers
  var ra=document.getElementById("reveal-all");
  if(ra){ra.addEventListener("click",function(){var ds=document.querySelectorAll(".practice details");var open=!ra.dataset.open;ds.forEach(function(d){d.open=open});ra.dataset.open=open?"1":"";ra.textContent=open?"Hide all answers":"Show all answers"})}
  // mobile menu
  var m=document.querySelector(".menu-btn"),s=document.querySelector(".side");
  if(m&&s){m.addEventListener("click",function(){s.classList.toggle("open")})}
  // on-this-page highlight
  var links=[].slice.call(document.querySelectorAll(".toc a"));
  if(links.length&&"IntersectionObserver" in window){
    var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id)})}})},{rootMargin:"-60px 0px -70% 0px"});
    document.querySelectorAll("article section[id]").forEach(function(sec){obs.observe(sec)});
  }
})();
// Type-your-answer boxes under every practice question, a self-check against the key, and a link to the graded Answer Lab
(function(){
  var art=document.querySelector("article"),md=document.getElementById("mark-done");
  if(!art||!md)return;
  var slug=md.getAttribute("data-u"),pre=slug.slice(0,2),LAB="https://claude.ai/artifact/Nqs3x8USLNhVN7P5hqdr2e";
  var AK="econ2-final-ans",st={};
  try{st=JSON.parse(localStorage.getItem(AK)||"{}")||{}}catch(e){st={}}
  function save(){try{localStorage.setItem(AK,JSON.stringify(st))}catch(e){}}
  var blocks=[].slice.call(art.querySelectorAll(".practice")).filter(function(b){return b.querySelector("details")});
  if(!blocks.length)return;
  var board=document.createElement("div");board.className="ansboard";
  var sec=document.getElementById("practice")||blocks[0].parentNode;
  var anchor=sec.querySelector(".tools")||sec.querySelector("h2");
  if(anchor&&anchor.parentNode===sec)anchor.insertAdjacentElement("afterend",board);else blocks[0].insertAdjacentElement("beforebegin",board);
  function tally(){
    var a=0,f=0,p=0,m=0;
    blocks.forEach(function(b,i){var r=st[pre+"-"+(i+1)];if(r&&r.t&&r.t.trim())a++;if(r&&r.s==="full")f++;if(r&&r.s==="part")p++;if(r&&r.s==="miss")m++});
    board.innerHTML='<p><strong>Your answers on this page:</strong> '+a+' of '+blocks.length+' typed · <span class="s-full">'+f+' full</span> · <span class="s-part">'+p+' partial</span> · <span class="s-miss">'+m+' missed</span>. Type an answer, press <em>Check my answer</em>, then mark how you did. For an automatic grade with feedback, use <a href="'+LAB+'#u'+pre+'" target="_blank" rel="noopener">the Answer Lab</a>.</p>';
  }
  blocks.forEach(function(b,i){
    var id=pre+"-"+(i+1),d=b.querySelector("details"),r=st[id]||(st[id]={});
    var w=document.createElement("div");w.className="mine";
    w.innerHTML='<label for="a'+id+'">Your answer</label><textarea id="a'+id+'" rows="3" placeholder="Type your answer the way you would write it in the exam box."></textarea>'+
      '<div class="mine-row"><button class="btn primary chk-btn" type="button">Check my answer</button><a class="btn" href="'+LAB+'#q'+id+'" target="_blank" rel="noopener">Grade it in the Answer Lab</a>'+
      '<span class="self" hidden>How did you do? <button type="button" data-s="full">Full credit</button><button type="button" data-s="part">Partial</button><button type="button" data-s="miss">Missed</button></span></div>';
    d.parentNode.insertBefore(w,d);
    var ta=w.querySelector("textarea"),self=w.querySelector(".self");ta.value=r.t||"";
    function paint(){b.classList.remove("got-full","got-part","got-miss");if(r.s)b.classList.add("got-"+r.s);w.querySelectorAll(".self button").forEach(function(x){x.classList.toggle("on",x.dataset.s===r.s)});if(r.s)self.hidden=false}
    var tm;ta.addEventListener("input",function(){clearTimeout(tm);tm=setTimeout(function(){r.t=ta.value;save();tally()},300)});
    w.querySelector(".chk-btn").addEventListener("click",function(){r.t=ta.value;save();d.open=true;self.hidden=false;tally();d.scrollIntoView({block:"nearest"})});
    w.querySelectorAll(".self button").forEach(function(x){x.addEventListener("click",function(){r.s=x.dataset.s;save();paint();tally()})});
    paint();
  });
  tally();
})();
