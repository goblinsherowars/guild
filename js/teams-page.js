import {teams} from '../data/teams.js?v=guild-teams-1';
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
      heading.textContent = `${t(list.dataset.teamList === 'guild' ? 'heroTeam' : 'rank')} ${index + 1}`;
      const portraits = document.createElement('div');
      portraits.innerHTML = heroTeamMarkup(ids.map(slot => Array.isArray(slot) ? slot[0] : slot));
      const names = document.createElement('p');
      names.className = 'team-names';
      names.textContent = ids.map(slot => (Array.isArray(slot) ? slot : [slot]).map(id => byId.get(id).name[language]).join(' / ')).join(' · ');
      card.append(heading, portraits, names);
      for (const slot of ids.filter(Array.isArray)) {
        const alternatives = document.createElement('div');
        const label = document.createElement('p');
        label.className = 'team-names';
        label.textContent = `${t('teamsReplacement')} ${byId.get(slot[0]).name[language]}: ${slot.slice(1).map(id => byId.get(id).name[language]).join(' / ')}`;
        const icons = document.createElement('div');
        icons.innerHTML = heroTeamMarkup(slot.slice(1));
        alternatives.append(label, icons);
        card.append(alternatives);
      }
      return card;
    });
    list.replaceChildren(...cards);
  });
  document.title = `${t('brand')} · ${t('teams')}`;
}

document.addEventListener('languagechange', render);
render();
