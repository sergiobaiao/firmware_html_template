
(function(){
  const STORAGE_KEY = "b884_theme";
  const validThemes = new Set(["0","1","2","3","4","5","6","7","8","9","10"]);

  function getSavedTheme(){
    try{
      const value = localStorage.getItem(STORAGE_KEY);
      return validThemes.has(value) ? value : "0";
    }catch(e){
      return "0";
    }
  }

  function applyTheme(value){
    const theme = validThemes.has(String(value)) ? String(value) : "0";
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch(e) {}
    const select = document.getElementById("theme-select");
    if(select && select.value !== theme) select.value = theme;
  }

  document.addEventListener("DOMContentLoaded", function(){
    applyTheme(getSavedTheme());
    const select = document.getElementById("theme-select");
    if(select){
      select.value = document.documentElement.getAttribute("data-theme") || getSavedTheme();
      select.addEventListener("change", function(){
        applyTheme(this.value);
      });
    }
  });

  window.applyTheme = applyTheme;
})();

/* ===== B884-M Shared UI Behaviors ===== */

/* --- Inject tooltip overlay if not present --- */
function ensureTipOverlay(){
  if(document.getElementById('tip_overlay'))return;
  var d=document.createElement('div');
  d.id='tip_overlay';
  d.onclick=function(e){if(e.target===this)closeTip();};
  d.innerHTML='<div id="tip_box" onclick="event.stopPropagation()"><div id="tip_content"></div><button class="btn primary" onclick="closeTip()" style="width:100%;margin-top:16px">Fechar</button></div>';
  document.body.appendChild(d);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',ensureTipOverlay);}
else{ensureTipOverlay();}

/* --- Tooltip/Modal --- */
function openTip(t){
  ensureTipOverlay();
  var c=document.getElementById('tip_content');
  c.className='';c.textContent=t;
  document.getElementById('tip_overlay').classList.add('active');
  document.body.style.overflow='hidden';
}
function openTipHtml(h){
  ensureTipOverlay();
  var c=document.getElementById('tip_content');
  c.className='rich';c.innerHTML=h;
  document.getElementById('tip_overlay').classList.add('active');
  document.body.style.overflow='hidden';
}
function closeTip(){
  document.getElementById('tip_overlay').classList.remove('active');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeTip();});
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-tip-html]');
  if(el){e.preventDefault();e.stopPropagation();openTipHtml(el.dataset.tipHtml);return;}
  var el2=e.target.closest('[data-tip]');
  if(el2){e.preventDefault();e.stopPropagation();openTip(el2.dataset.tip);return;}
  var el3=e.target.closest('.tip-hit[onclick]');
  /* onclick handlers call openTip directly, let them through */
});

/* --- Toggle password visibility --- */
function togglePass(checkboxEl, inputId){
  document.getElementById(inputId).type=checkboxEl.checked?'text':'password';
}
function togglePassMulti(checkboxEl, ids){
  var type=checkboxEl.checked?'text':'password';
  ids.forEach(function(id){document.getElementById(id).type=type;});
}

/* --- Simple subtab switching --- */
function switchSubtab(showId, hideIds, clickedEl){
  document.getElementById(showId).style.display='';
  hideIds.forEach(function(id){document.getElementById(id).style.display='none';});
  var tabs=clickedEl.parentElement.children;
  for(var i=0;i<tabs.length;i++) tabs[i].classList.remove('active');
  clickedEl.classList.add('active');
}

/* --- Conditional field visibility --- */
function showIf(selectEl, valueMap){
  Object.keys(valueMap).forEach(function(val){
    var ids=valueMap[val];
    ids.forEach(function(id){
      document.getElementById(id).style.display=(selectEl.value===val)?'':'none';
    });
  });
}
