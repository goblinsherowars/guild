import test from 'node:test';import assert from 'node:assert/strict';import {translations} from '../js/i18n.js';
test('critical navigation labels exist in both languages',()=>{for(const l of ['ru','en']) for(const k of ['home','players','dungeon','hydra','heroes','titans','guildVs','about']) assert.ok(translations[l][k])});
test('Guild VS English label is exact',()=>assert.equal(translations.en.guildVs,'Guild VS'));
