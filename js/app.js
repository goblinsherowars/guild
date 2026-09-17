import {applyTranslations,setLanguage} from './i18n.js';
const nav=[['index.html','home'],['players.html','players'],['dungeon.html','dungeon'],['heroes.html','heroes'],['teams.html','teams'],['titans.html','titans'],['guild-vs.html','guildVs'],['about.html','about']];
function shell(){
 const header=document.querySelector('[data-shell-header]'); if(header) header.innerHTML=`<div class="topbar"><a class="brand" href="index.html"><img src="assets/images/guild-crest.png" alt="Goblins guild crest"><span><b data-i18n="brand">Гоблины</b><small data-i18n="motto"></small></span></a><div class="langs"><button data-lang="ru">RU</button><button data-lang="en">EN</button></div></div><nav>${nav.map(([href,key])=>`<a href="${href}" data-nav="${href}" data-i18n="${key}"></a>`).join('')}</nav>`;
 const footer=document.querySelector('[data-shell-footer]'); if(footer) footer.innerHTML=`<span data-i18n="footer"></span>`;
 const current=location.pathname.split('/').pop()||'index.html'; document.querySelector(`[data-nav="${current}"]`)?.classList.add('active');
 document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
 applyTranslations();
}
shell();
