import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {heroes} from '../data/heroes.js';
import {setLanguage} from '../js/i18n.js';

test('Hydra guide loads both languages, renders core portraits, and reuses cached text', async () => {
  const container = {
    innerHTML: '', attributes: {}, lineups: [],
    setAttribute(key, value) { this.attributes[key] = value; },
    replaceChildren(...children) { this.children = children; },
    append(child) { this.children.push(child); },
    querySelectorAll() {
      this.lineups = [...this.innerHTML.matchAll(/data-hero-lineup="([^"]+)"/g)]
        .map(match => ({dataset: {heroLineup: match[1]}, innerHTML: ''}));
      return this.lineups;
    },
  };
  const doc = new EventTarget();
  doc.documentElement = {lang: 'ru'};
  doc.querySelector = () => container;
  doc.querySelectorAll = () => [];
  doc.createElement = () => ({setAttribute() {}});
  const oldFetch = globalThis.fetch;
  const requests = [];
  globalThis.document = doc;
  globalThis.fetch = async url => {
    requests.push(url);
    return {ok: true, text: async () => fs.readFileSync(url.split('?')[0], 'utf8')};
  };
  const settle = () => new Promise(resolve => setImmediate(resolve));
  try {
    await import('../js/hydra-page.js');
    await settle();
    assert.match(container.innerHTML, /Краткая инструкция по Гидре/);
    for (const language of ['en', 'ru']) {
      setLanguage(language);
      await settle();
      assert.match(container.innerHTML, language === 'ru' ? /Что делать каждый день/ : /What to do every day/);
      assert.equal(container.attributes['aria-busy'], 'false');
      assert.equal(container.lineups.length, 3);
      assert.deepEqual(container.lineups.map(lineup => (lineup.innerHTML.match(/<img /g) || []).length), [2, 3, 5]);
      for (const lineup of container.lineups) for (const id of lineup.dataset.heroLineup.split(' ')) {
        const hero = heroes.find(hero => hero.id === id);
        assert.ok(hero, id);
        assert.ok(fs.existsSync(hero.image), hero.image);
      }
    }
    assert.equal(requests.length, 2);
  } finally {
    globalThis.fetch = oldFetch;
    delete globalThis.document;
  }
});
