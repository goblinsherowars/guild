import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {translations} from '../js/i18n.js';

test('all pages route cached module imports to the current translation dictionary', () => {
  for (const page of fs.readdirSync('.').filter(name => name.endsWith('.html'))) {
    const html = fs.readFileSync(page, 'utf8');
    const map = html.match(/<script type="importmap">([\s\S]*?)<\/script>/);
    assert.ok(map, `${page}: translation import map is required`);
    const target = JSON.parse(map[1]).imports['./js/i18n.js'];
    assert.equal(target, './js/i18n.js?v=championship-1');
    assert.ok(html.indexOf(map[0]) < html.indexOf('<script type="module"'), page);
  }
});

test('all Teams page labels and example headings have Russian and English translations', () => {
  const html = fs.readFileSync('teams.html', 'utf8');
  const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1]);
  keys.push('teamsExample');
  for (const key of keys) {
    assert.match(translations.ru[key], /[А-Яа-яЁё]/, key);
    assert.ok(translations.en[key], key);
    assert.notEqual(translations.en[key], key);
  }
});
