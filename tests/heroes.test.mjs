import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {heroes} from '../data/heroes.js';
import {translations, setLanguage} from '../js/i18n.js';

test('catalog covers every supplied portrait exactly once with bilingual content', () => {
  const files = fs.readdirSync('assets/heroes').filter(file => file.endsWith('.png')).sort();
  assert.deepEqual(heroes.map(hero => hero.image.split('/').pop()).sort(), files);
  assert.equal(new Set(heroes.map(hero => hero.id)).size, files.length);
  for (const hero of heroes) {
    assert.equal(new URL(hero.source).protocol, 'https:');
    for (const language of ['ru', 'en']) {
      assert.ok(hero.name[language].trim());
      assert.ok(hero.description[language].trim());
      assert.ok(translations[language][`heroRole_${hero.role}`]);
    }
  }
  const html = fs.readFileSync('heroes.html', 'utf8');
  for (const [, key] of html.matchAll(/data-i18n(?:-placeholder)?="([^"]+)"/g)) {
    for (const language of ['ru', 'en']) assert.ok(translations[language][key], `${language}: ${key}`);
  }
});

test('catalog renders, searches both languages, filters classes and preserves state on language change', async () => {
  class Element extends EventTarget {
    value = '';
    children = [];
    attributes = {};
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(key, value) { this.attributes[key] = value; }
  }
  const nodes = Object.fromEntries(['search', 'role', 'catalog', 'count', 'empty', 'reference']
    .map(key => [`[data-hero-${key}]`, new Element()]));
  const document = new EventTarget();
  document.documentElement = {};
  document.querySelector = selector => nodes[selector];
  document.querySelectorAll = () => [];
  document.createElement = () => new Element();
  globalThis.document = document;
  try {
    setLanguage('ru');
    const {selectHeroes} = await import('../js/heroes-page.js');
    const catalog = nodes['[data-hero-catalog]'];
    assert.equal(catalog.children.length, heroes.length);
    const ranked = selectHeroes();
    assert.deepEqual(ranked.slice(0, 5).map(hero => hero.id), ['aidan', 'iris', 'byrna', 'folio', 'electra-von-grave']);
    assert.equal(ranked.find(hero => hero.id === 'fox').rank, 81);
    assert.equal(ranked.find(hero => hero.id === 'lara-croft')?.rank, 46);
    assert.equal(ranked.find(hero => hero.id === 'teenage-mutant-ninja-turtles')?.rank, 76);
    assert.equal(ranked.at(-1).id, 'eva');
    assert.deepEqual(selectHeroes('', '', 'en').map(hero => hero.id), ranked.map(hero => hero.id));
    const tankRanks = selectHeroes('', 'tank').map(hero => hero.rank);
    assert.deepEqual(tankRanks, [...tankRanks].sort((a, b) => a - b));
    assert.equal(catalog.children[0].children[1].children[2].textContent, 'Место в рейтинге: 1');
    for (const [query, expected] of [['  АрТемИс ', 'artemis'], ['Galachad', 'galahad'],
      ['ЛЮТЕР', 'luther'], ['K’arkh', 'k-arkh'], ['Карх', 'k-arkh'],
      ['Фолио', 'folio'], ['Темная Звезда', 'dark-star'], ['Astrid & Lucas', 'astrid-lucas']]) {
      assert.deepEqual(selectHeroes(query).map(hero => hero.id), [expected], query);
    }
    nodes['[data-hero-search]'].value = 'Артемис';
    nodes['[data-hero-search]'].dispatchEvent(new Event('input'));
    assert.equal(catalog.children.length, 1);
    assert.equal(catalog.children[0].children[0].alt, 'Артемис');
    nodes['[data-hero-role]'].value = 'marksman';
    nodes['[data-hero-role]'].dispatchEvent(new Event('change'));
    setLanguage('en');
    assert.equal(catalog.children.length, 1);
    assert.equal(catalog.children[0].children[0].alt, 'Artemis');
    assert.equal(catalog.children[0].children[1].children[1].textContent, 'Marksman');
    assert.equal(catalog.children[0].children[1].children[2].textContent, 'Rank: 53');
    assert.equal(catalog.children[0].children[2].textContent, heroes.find(hero => hero.id === 'artemis').description.en);
    assert.equal(nodes['[data-hero-search]'].value, 'Артемис');
    assert.equal(document.title, 'Goblins · Heroes');
    assert.match(nodes['[data-hero-reference]'].href, /en-us/);
    nodes['[data-hero-role]'].value = 'tank';
    nodes['[data-hero-role]'].dispatchEvent(new Event('change'));
    assert.equal(catalog.children.length, 0);
    assert.equal(nodes['[data-hero-empty]'].hidden, false);
    assert.equal(nodes['[data-hero-count]'].textContent, `Heroes shown: 0 / ${heroes.length}`);
    assert.deepEqual(selectHeroes('no-such-hero'), []);
    assert.ok(selectHeroes('', 'tank').every(hero => hero.role === 'tank'));
    setLanguage('ru');
  } finally {
    delete globalThis.document;
  }
});
