import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";
import { articleDatesFilter } from "../lib/modules/notes/article-dates.filter.js";

const directory = mkdtempSync(join(tmpdir(), "article-dates-"));
after(() => rmSync(directory, { recursive: true, force: true }));

function git(...args) {
  return execFileSync("git", args, { cwd: directory, stdio: "pipe" });
}

function commit(date) {
  git("add", ".");
  execFileSync("git", ["commit", "--no-gpg-sign", "-m", "Update article"], {
    cwd: directory,
    stdio: "pipe",
    env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
  });
}

function createFilter() {
  let beforeBuild;
  const filter = articleDatesFilter({
    on(event, callback) {
      assert.equal(event, "eleventy.before");
      beforeBuild = callback;
    },
  });
  return { filter, rebuild: () => beforeBuild() };
}

git("init");
git("config", "user.name", "Article date test");
git("config", "user.email", "article-dates@example.test");
const originalPath = join(directory, "Original article.md");
writeFileSync(originalPath, "# Article\n\nOriginal content.\n");
commit("2026-01-20T23:30:00-08:00");
writeFileSync(originalPath, "# Article\n\nUpdated content.\n");
commit("2026-01-25T23:30:00-08:00");
const inputPath = join(directory, "Renamed article [1].md");
renameSync(originalPath, inputPath);
commit("2026-02-16T23:30:00-08:00");
const page = { inputPath, date: new Date("2026-10-26T00:00:00Z") };

test("uses the original commit through renames and preserves calendar dates", () => {
  const { filter } = createFilter();
  assert.deepEqual(filter(page), {
    published: { iso: "2026-01-20", label: "January 20, 2026" },
    lastModified: { iso: "2026-02-16", label: "February 16, 2026" },
  });
});

test("front matter can override each date independently, including YAML dates", () => {
  const { filter } = createFilter();
  assert.deepEqual(filter(page, new Date("2025-12-01T00:00:00Z"), "2026-03-15"), {
    published: { iso: "2025-12-01", label: "December 1, 2025" },
    lastModified: { iso: "2026-03-15", label: "March 15, 2026" },
  });
  assert.equal(filter(page, "2025-12-01").lastModified.iso, "2026-02-16");
  assert.equal(filter(page, undefined, "2026-03-15").published.iso, "2026-01-20");
});

test("untracked articles never use checkout dates as publication dates", () => {
  const { filter } = createFilter();
  const untrackedPage = { ...page, inputPath: join(directory, "New article.md") };
  writeFileSync(untrackedPage.inputPath, "# New article\n");
  assert.equal(filter(untrackedPage), null);
  assert.deepEqual(filter(untrackedPage, "2026-10-01"), {
    published: { iso: "2026-10-01", label: "October 1, 2026" },
    lastModified: null,
  });
  assert.deepEqual(filter(untrackedPage, undefined, "2026-10-02"), {
    published: null,
    lastModified: { iso: "2026-10-02", label: "October 2, 2026" },
  });
});

test("source archives without a Git repository still render dates", () => {
  const archive = mkdtempSync(join(tmpdir(), "article-archive-"));
  try {
    const archivePage = { ...page, inputPath: join(archive, "Article.md") };
    writeFileSync(archivePage.inputPath, "# Article\n");
    const { filter } = createFilter();
    assert.equal(filter(archivePage), null);
    assert.equal(filter(archivePage, "2025-12-01", "2026-01-02").published.iso, "2025-12-01");
    assert.equal(filter(archivePage, "2025-12-01", "2026-01-02").lastModified.iso, "2026-01-02");
  } finally {
    rmSync(archive, { recursive: true, force: true });
  }
});

test("invalid front matter dates fail with a useful error", () => {
  const { filter } = createFilter();
  assert.throws(() => filter(page, "2026-02-30"), /Invalid article date/);
  assert.throws(() => filter(page, undefined, "yesterday"), /Use YYYY-MM-DD/);
});

test("rebuilds refresh committed dates without resetting publication", () => {
  const { filter, rebuild } = createFilter();
  assert.equal(filter(page).lastModified.iso, "2026-02-16");
  writeFileSync(inputPath, "# Article\n\nAnother update.\n");
  commit("2026-10-26T12:00:00-07:00");
  rebuild();
  assert.equal(filter(page).published.iso, "2026-01-20");
  assert.equal(filter(page).lastModified.iso, "2026-10-26");
});

test("shallow deployments use saved dates and never mistake the tip for publication", () => {
  const checkout = mkdtempSync(join(tmpdir(), "article-shallow-"));
  try {
    execFileSync("git", ["clone", "--depth=1", pathToFileURL(directory).href, checkout], {
      stdio: "pipe",
    });
    assert.equal(execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      cwd: checkout,
      encoding: "utf8",
    }).trim(), "true");
    const shallowPage = { ...page, inputPath: join(checkout, "Renamed article [1].md") };
    const { filter } = createFilter();
    assert.equal(filter(shallowPage), null);
    assert.deepEqual(filter(shallowPage, "2026-01-20", "2026-01-25"), {
      published: { iso: "2026-01-20", label: "January 20, 2026" },
      lastModified: { iso: "2026-01-25", label: "January 25, 2026" },
    });
    assert.equal(filter(shallowPage, "2026-01-20").lastModified, null);
  } finally {
    rmSync(checkout, { recursive: true, force: true });
  }
});
