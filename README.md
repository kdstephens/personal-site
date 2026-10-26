I'm using [Eleventy Notes](https://eleventy-notes.sandroroth.com/).

## Article dates

Articles show publication and last-modified dates in small italic text below the
title. The homepage and topic pages do not display article dates.

For reliable dates on Cloudflare and other hosts, store both dates in the article's
front matter:

```yaml
published: 2026-01-20
lastModified: 2026-10-21
```

Keep `published` fixed and update `lastModified` when you edit an article. Existing
articles have been backfilled from their earliest available Git history and most
recent content changes, ignoring moves that did not change the content. These are
estimates of publication dates; replace them if you know the exact dates the
articles went live.

If a field is omitted, a checkout with full Git history can supply it automatically
(following renames). Shallow checkouts and source archives cannot recover these
dates. Unknown dates are omitted instead of displaying the deployment date. File
creation times are never used as publication dates.

## Build and styling

On Cloudflare Pages, use `.app` as the root directory, `npm run build` as the build
command, and `dist` as the output directory. The build compiles CSS and JavaScript
before generating HTML so asset URLs can include a hash of their contents. These
versioned URLs prevent browsers from using a cached stylesheet from an older
deployment.

Run the checks from `.app` with `npm test` and build the site with `npm run build`.
