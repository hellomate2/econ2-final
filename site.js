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
