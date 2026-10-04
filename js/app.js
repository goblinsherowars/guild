import {applyTranslations,setLanguage} from './i18n.js';
const nav=[['index.html','home'],['dungeon.html','dungeon'],['hydra.html','hydra'],['heroes.html','heroes'],['teams.html','teams'],['titans.html','titans'],['guild-vs.html','guildVs'],['about.html','about']];
function shell(){
 const header=document.querySelector('[data-shell-header]'); if(header) header.innerHTML=`<div class="topbar"><a class="brand" href="index.html"><img src="assets/images/guild-crest.png" alt="Goblins guild crest"><span><b data-i18n="brand">Гоблины</b><small data-i18n="motto"></small></span></a><div class="header-actions"><a class="header-telegram" href="https://t.me/nickherowars" target="_blank" rel="noopener noreferrer"><svg class="telegram-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21.4 3.2 2.7 10.4c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.8 5.5c.2.6.1.8.7.8.4 0 .6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.9l3.1-14.6c.3-1.3-.5-1.9-1.2-1.6ZM8.1 13.1l10.8-6.8c.5-.3.9-.1.6.2l-8.9 8-.3 3.5-2.2-4.9Z"/></svg><span data-i18n="guildTelegram">Telegram-канал гильдии</span></a><div class="langs"><button data-lang="ru">RU</button><button data-lang="en">EN</button></div></div></div><nav>${nav.map(([href,key])=>`<a href="${href}" data-nav="${href}" data-i18n="${key}"></a>`).join('')}</nav>`;
 const footer=document.querySelector('[data-shell-footer]'); if(footer) footer.innerHTML=`<span data-i18n="footer"></span>`;
 const current=location.pathname.split('/').pop()||'index.html'; document.querySelector(`[data-nav="${current}"]`)?.classList.add('active');
 document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
 applyTranslations();
}
shell();
