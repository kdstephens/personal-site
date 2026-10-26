import { execFileSync } from "node:child_process";
import { basename, dirname, resolve } from "node:path";

/** Read committed article dates, following the file through renames. */
function gitDates(inputPath) {
  const filePath = resolve(inputPath);
  const options = {
    cwd: dirname(filePath),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  };

  try {
    // A shallow checkout can falsely attribute every file to the latest deploy.
    if (execFileSync("git", ["rev-parse", "--is-shallow-repository"], options).trim() === "true") {
      return [];
    }

    return execFileSync(
      "git",
      ["--literal-pathspecs", "log", "--follow", "--format=%cI", "--", basename(filePath)],
      options
    ).trim().split("\n").filter(Boolean);
  } catch {
    // Source archives and new files may not have Git history.
    return [];
  }
}

function formatDate(value, locale) {
  // Keep the calendar date from the source, regardless of the build's timezone.
  const iso = value instanceof Date
    ? value.toISOString().slice(0, 10)
    : String(value).slice(0, 10);
  const date = new Date(`${iso}T00:00:00Z`);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== iso) {
    throw new Error(`Invalid article date: ${value}. Use YYYY-MM-DD.`);
  }

  return {
    iso,
    label: new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(date),
  };
}

export const articleDatesFilter = (config) => {
  const cache = new Map();
  config.on("eleventy.before", () => cache.clear());

  return (page, published, lastModified, locale = "en-US") => {
    let history = [];
    if (published == null || lastModified == null) {
      if (!cache.has(page.inputPath)) {
        cache.set(page.inputPath, gitDates(page.inputPath));
      }
      history = cache.get(page.inputPath);
    }

    const publishedDate = published ?? history.at(-1);
    const modifiedDate = lastModified ?? history[0];

    // Checkout/creation times describe the build, not the article's publication.
    if (publishedDate == null && modifiedDate == null) return null;

    return {
      published: publishedDate == null ? null : formatDate(publishedDate, locale),
      lastModified: modifiedDate == null ? null : formatDate(modifiedDate, locale),
    };
  };
};
