import {heroTeamMarkup} from './hero-team.js';
import {getLanguage, t} from './i18n.js';

const container = document.querySelector('[data-hydra-guide]');
const cache = new Map();
let currentRequest = 0;

async function loadGuide() {
  const request = ++currentRequest;
  const language = getLanguage() === 'en' ? 'en' : 'ru';
  const source = `content/hydra/${language}.html`;
  container.setAttribute('aria-busy', 'true');
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.textContent = t('guideLoading');
  container.replaceChildren(status);

  try {
    if (!cache.has(language)) {
      const response = await fetch(`${source}?v=hydra-icons-2`);
      if (!response.ok) throw new Error(`Guide request failed: ${response.status}`);
      cache.set(language, await response.text());
    }
    if (request !== currentRequest) return;
    // These HTML fragments are maintained locally as part of the site.
    container.innerHTML = cache.get(language);
    for (const lineup of container.querySelectorAll('[data-hero-lineup]')) {
      lineup.innerHTML = heroTeamMarkup(lineup.dataset.heroLineup.split(' '));
    }
  } catch {
    if (request !== currentRequest) return;
    status.textContent = t('guideLoadError');
    const link = document.createElement('a');
    link.href = source;
    link.className = 'guide-source';
    link.textContent = t('guideOpen');
    container.append(link);
  } finally {
    if (request === currentRequest) container.setAttribute('aria-busy', 'false');
  }
}

if (container) {
  document.addEventListener('languagechange', loadGuide);
  loadGuide();
}
