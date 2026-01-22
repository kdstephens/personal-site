// @ts-check
import { defineConfig, createNotesQuery } from "./.app/app-config.js";

export default defineConfig({
  title: "Kyle D Stephens 🥳",
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
      {
        label: "",
        groups: [
          {
            query: createNotesQuery({
              pattern: "/Projects",
              tree: true,
            }),
          },
        ],

      },
      {
        label: "",
        groups: [
          {
            query: createNotesQuery({
              pattern: "/Programs",
              tree: true,
            }),
          },
        ],
      },
      {
        label: "",
        groups: [
          {
            query: createNotesQuery({
              pattern: "/Notes to Self",
              tree: true,
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
