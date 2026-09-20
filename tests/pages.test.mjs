import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const pages=['index.html','players.html','dungeon.html','hydra.html','heroes.html','titans.html','guild-vs.html','about.html'];
test('all portal pages exist and load common shell',()=>{for(const p of pages){assert.ok(fs.existsSync(p),p);const s=fs.readFileSync(p,'utf8');assert.match(s,/js\/app\.js/);assert.match(s,/css\/styles\.css/)}});
