import {teams} from '../data/teams.js?v=championship-2';
import {heroes} from '../data/heroes.js';
import {heroTeamMarkup} from './hero-team.js';
import {getLanguage, t} from './i18n.js';

const byId = new Map(heroes.map(hero => [hero.id, hero]));

function render() {
  const language = getLanguage() === 'en' ? 'en' : 'ru';
  document.querySelectorAll('[data-team-list]').forEach(list => {
    const cards = teams[list.dataset.teamList].map((ids, index) => {
      const card = document.createElement('li');
      card.className = 'team-card';
      const heading = document.createElement('h4');
      heading.textContent = `${t(list.dataset.teamList === 'guild' ? 'teamsExample' : 'rank')} ${index + 1}`;
      const portraits = document.createElement('div');
      portraits.innerHTML = heroTeamMarkup(ids);
      const names = document.createElement('p');
      names.className = 'team-names';
      names.textContent = ids.map(id => byId.get(id).name[language]).join(' · ');
      card.append(heading, portraits, names);
      return card;
    });
    list.replaceChildren(...cards);
  });
  document.title = `${t('brand')} · ${t('teams')}`;
}

document.addEventListener('languagechange', render);
render();
