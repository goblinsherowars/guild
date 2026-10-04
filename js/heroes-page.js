import {heroes} from '../data/heroes.js';
import {getLanguage, t} from './i18n.js';

const search = document.querySelector('[data-hero-search]');
const role = document.querySelector('[data-hero-role]');
const catalog = document.querySelector('[data-hero-catalog]');
const normalize = value => value.toLocaleLowerCase().replace(/ё/g, 'е').replace(/['’‘`\s&-]/g, '');

export function selectHeroes(query = '', selectedRole = '', language = 'ru') {
  const needle = normalize(query.trim());
  return heroes.filter(hero => (!selectedRole || hero.role === selectedRole) &&
    [hero.name.ru, hero.name.en, hero.image.split('/').pop().replace('.png', ''),
      ...(hero.id === 'folio' ? ['Фолио'] : [])].some(name => normalize(name).includes(needle)))
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) ||
      a.name[language].localeCompare(b.name[language], language));
}

function render() {
  const language = getLanguage() === 'en' ? 'en' : 'ru';
  const filtered = selectHeroes(search.value, role.value, language);
  const cards = filtered.map(hero => {
    const card = document.createElement('article');
    card.className = 'hero-card';
    const portrait = document.createElement('img');
    portrait.src = `${hero.image}?v=portraits-2`;
    portrait.alt = hero.name[language];
    portrait.width = 88;
    portrait.height = 88;
    portrait.loading = 'lazy';
    portrait.decoding = 'async';
    const heading = document.createElement('div');
    heading.className = 'hero-card-heading';
    const name = document.createElement('h2');
    name.textContent = hero.name[language];
    const badge = document.createElement('span');
    badge.className = 'hero-role';
    badge.textContent = t(`heroRole_${hero.role}`);
    const rank = document.createElement('span');
    rank.className = 'hero-rank';
    rank.textContent = hero.rank ? `${t('heroRank')}: ${hero.rank}` : t('heroUnranked');
    heading.append(name, badge, rank);
    const description = document.createElement('p');
    description.textContent = hero.description[language];
    const source = document.createElement('a');
    source.className = 'hero-source';
    source.href = hero.source;
    source.textContent = t('heroSource');
    source.setAttribute('aria-label', `${t('heroSource')}: ${hero.name[language]}`);
    card.append(portrait, heading, description, source);
    return card;
  });
  catalog.replaceChildren(...cards);
  document.querySelector('[data-hero-count]').textContent = `${t('heroShown')}: ${filtered.length} / ${heroes.length}`;
  document.querySelector('[data-hero-empty]').hidden = filtered.length > 0;
  document.querySelector('[data-hero-reference]').href = `https://support-hwa.nexters.com/hc/${language === 'en' ? 'en-us' : 'ru'}/articles/6116195484306-${language === 'en' ? 'General-Information-About-Heroes' : 'Общая-информация-о-героях'}`;
  document.title = `Goblins · ${t('heroes')}`;
}

search.addEventListener('input', render);
role.addEventListener('change', render);
document.addEventListener('languagechange', render);
render();
