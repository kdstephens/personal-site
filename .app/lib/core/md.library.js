import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItTaskCheckbox from "markdown-it-task-checkbox";
import markdownItFootnote from "markdown-it-footnote";
import { imgSize } from "@mdit/plugin-img-size";
import { wikilinksModule } from "./../modules/wikilinks/index.js";
import { notesModule } from "./../modules/notes/index.js";
import { calloutsModule } from "./../modules/callouts/index.js";

/**
 * Creates a markdown-it instance.
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @returns The configured markdown library.
 */
export const markdownLibrary = (eleventyConfig) => {
  const lib = markdownIt({
    html: true,
    linkify: true,
  })
    .use(externalLinksPlugin)
    .use(figureCaptionsPlugin)
    .use(imgSize)
    .use(markdownItTaskCheckbox)
    .use(markdownItFootnote)
    .use(notesModule.copyCodeMarkdownPlugin)
    .use(calloutsModule.markdownPlugin)
    .use(wikilinksModule.markdownPlugin, {
      collections: "_notes",
      slugify: eleventyConfig.getFilter("slugifyPath"),
      slugifyAnchor: eleventyConfig.getFilter("slugify"),
    })
    .use(markdownItAnchor, {
      slugify: eleventyConfig.getFilter("slugify"),
      level: [1, 2, 3, 4],
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "anchor-link",
        symbol: `<svg><use xlink:href="#icon-anchor-link"></use></svg>`,
      }),
    });

  return lib;
};

function externalLinksPlugin(md) {
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const href = token.attrGet("href") || "";

    if (isExternalLink(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener");
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}

function isExternalLink(href) {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("/")) return false;
  if (href.startsWith("mailto:")) return false;
  if (href.startsWith("tel:")) return false;
  return /^https?:\/\//i.test(href);
}

function figureCaptionsPlugin(md) {
  const defaultRender =
    md.renderer.rules.image ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const title = token.attrGet("title");
    const imageHtml = defaultRender(tokens, idx, options, env, self);

    if (!title) return imageHtml;

    const caption = md.utils.escapeHtml(title);
    return `<figure class="figure">${imageHtml}<figcaption class="figure__caption">${caption}</figcaption></figure>`;
  };
}
