import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

test("UI lint accepts accessible markup and rejects each configured React/accessibility violation", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "alpas-ui-lint-"));
  const fixture = path.join(directory, "fixture.tsx");
  const run = (code) => {
    writeFileSync(fixture, code);
    return spawnSync(
      process.execPath,
      [
        path.resolve("node_modules/oxlint/bin/oxlint"),
        "-c",
        path.resolve(".oxlintrc.json"),
        "--deny-warnings",
        fixture,
      ],
      { encoding: "utf8", timeout: 30000 },
    );
  };
  try {
    const valid = run(`const view = <section>
      <button type="button">검색</button><img alt="도서 표지" src="cover.png" />
      <label htmlFor="title">서명</label><input id="title" />
      {books.map(book => <span key={book.id}>{book.title}</span>)}
    </section>;`);
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stdout + valid.stderr);
    const invalid = run(`const view = <section>
      <button>검색</button><img src="cover.png" /><label>서명</label>
      <div onClick={search}>검색</div>
      <div role="button" onClick={search} onKeyDown={search}>검색</div>
      {books.map(book => <span>{book.title}</span>)}
      {books.map((book, index) => <span key={index}>{book.title}</span>)}
    </section>;`);
    assert.ifError(invalid.error);
    assert.equal(invalid.status, 1, invalid.stdout + invalid.stderr);
    const output = invalid.stdout + invalid.stderr;
    for (const name of [
      "jsx-key",
      "no-array-index-key",
      "button-has-type",
      "alt-text",
      "label-has-associated-control",
      "click-events-have-key-events",
      "no-static-element-interactions",
      "interactive-supports-focus",
    ]) {
      assert.ok(output.includes(name), `Missing diagnostic: ${name}\n${output}`);
    }
  } finally {
    unlinkSync(fixture);
    rmdirSync(directory);
  }
});
