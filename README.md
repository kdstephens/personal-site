I'm using [Eleventy Notes](https://eleventy-notes.sandroroth.com/).

## Article dates

Articles show their original publication and last-modified dates below the title.
These use the first and most recent Git commits for the Markdown file, following
renames. The homepage and topic pages do not display article dates. Commit article
edits and rebuild the site to update the last-modified date.

Use a checkout with full Git history when building (for GitHub Actions, set
`fetch-depth: 0` on `actions/checkout`). Git history provides an estimate of the
publication date; to specify the actual publication date or override the modification
date, add either field to the article's front matter:

```yaml
published: 2026-01-20
lastModified: 2026-10-21
```

For files without Git history, the dates fall back to Eleventy's page date (the
front matter `date`, if provided, otherwise the file's creation date). Explicit
front matter dates also work when building from a source archive without Git.

Run the checks from `.app` with `npm test` and build the site with `npm run build`.
