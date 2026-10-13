const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);

for (const hash of ['#web', '#ai', '', '#unknown']) {
  test(`root discovery and visible arm: ${hash || 'neutral'}`, () => {
    const links = [], attributes = {}, nodes = {}, names = [{}, {}], events = {};
    let reloads = 0;
    const context = {
      location: { hash, reload() { reloads++; } },
      window: { addEventListener(name, cb) { events[name] = cb; } },
      document: {
        title: 'Information and AI Settings in Search Engines',
        createElement(tag) { assert.equal(tag, 'link'); return {}; },
        head: { appendChild(link) { links.push(link); } },
        documentElement: { setAttribute(key, value) { attributes[key] = value; } },
        querySelectorAll(selector) { assert.equal(selector, '.engine'); return names; },
        getElementById(id) { return nodes[id] ||= {}; }
      }
    };
    vm.createContext(context);
    scripts.forEach(script => vm.runInContext(script, context));
    const arm = hash.slice(1);
    if (arm === 'web' || arm === 'ai') {
      const name = arm === 'web' ? 'Google Web' : 'Google AI Mode';
      assert.equal(links.length, 1);
      assert.deepEqual(links[0], { rel: 'search', type: 'application/opensearchdescription+xml', title: name, href: `osdd/${arm}-v2.xml` });
      assert.ok(fs.existsSync(path.join(root, links[0].href)));
      assert.equal(attributes['data-arm'], arm);
      names.forEach(node => assert.equal(node.textContent, name));
      assert.ok(nodes.effect.textContent.length > 0);
      assert.ok(nodes.check.textContent.length > 0);
    } else {
      assert.equal(links.length, 0);
      assert.equal(attributes['data-arm'], undefined);
      assert.deepEqual(nodes, {});
    }
    events.hashchange();
    assert.equal(reloads, 1);
  });
}
test('ordinary canonical activation on both phone instructions', () => {
  const links = [...html.matchAll(/<a\b([^>]*href="([^"]+)"[^>]*)>Search once on Google<\/a>/g)];
  assert.equal(links.length, 2);
  links.forEach(link => {
    assert.equal(link[2], 'https://www.google.com/search?q=weather');
    assert.match(link[1], /\btarget="_blank"/);
    assert.match(link[1], /\brel="noopener"/);
  });
  assert.ok(!html.includes('https://google.com/search'));
});
test('setup copy preserves instructions and returns participants to their survey', () => {
  assert.ok(!html.includes('This page does not see your searches.'));
  assert.ok(html.includes('Follow the instructions on this setup page for your phone.'));
  assert.equal((html.match(/switch back to this setup tab and continue below/g) || []).length, 2);
  assert.ok(html.includes('return to your survey and follow its instructions to continue.'));
});
for (const arm of ['web', 'ai']) {
  test(`${arm} Continue preserves stable root fragment`, () => {
    const page = fs.readFileSync(path.join(root, arm, 'index.html'), 'utf8');
    assert.ok(page.includes(`href="/#${arm}">Continue</a>`));
    assert.ok(!page.includes('application/opensearchdescription+xml'));
    assert.ok(page.includes(`follow the instructions on the ${arm === 'web' ? 'Google Web' : 'Google AI Mode'} setup page`));
    assert.ok(page.includes('return to your survey to continue.'));
  });
}
