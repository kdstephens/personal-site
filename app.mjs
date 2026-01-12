// @ts-check
import { defineConfig, createNotesQuery } from "./.app/app-config.js";

export default defineConfig({
  title: "Kyle David Stephens",
  description:
    "A personal website, built using Eleventy Notes",
  // editThisNote: {
  //   url: "https://github.com/rothsandro/eleventy-notes/edit/{{branch}}/{{file}}",
  // },
  staticAssets: {
    paths: { "public/": "/" },
  },
  ignores: ["README.md", "CHANGELOG.md"],
  customProperties: {
    properties: [
      {
        path: "props",
        options: {
          date: {
            locale: "en-US",
          },
        },
      },
    ],
  },
  notes: {
    // // Change the prefix to something else
    // pathPrefix: "/articles",

    // Remove the prefix entirely
    pathPrefix: "/",
  },
  sidebar: {
    // links: [
    //   {
    //     url: "https://github.com/rothsandro/eleventy-notes",
    //     label: "GitHub / Support",
    //     icon: "github",
    //   },
    //   {
    //     url: "https://www.buymeacoffee.com/sandroroth",
    //     label: "Buy me a coffee",
    //     icon: "coffee",
    //   },
    // ],
    sections: [
      // {
    //     label: "Introduction",
    //     groups: [
    //       {
    //         query: createNotesQuery({
    //           pattern: "^/[^/]+$",
    //           tags: ["basics"],
    //         }),
    //       },
    //     ],
    //   },
      {
        label: "Programs",
        groups: [
          {
            // label: "Programs",
            query: createNotesQuery({
              tags: ["program"],
            }),
          },
        ],
      },
    ],
  },
  // tags: {
  //   map: {
  //     "dynamic-content": "dynamic content",
  //   },
  // },
});
