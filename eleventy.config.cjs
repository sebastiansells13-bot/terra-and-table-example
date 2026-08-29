const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss").default;
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

const isProduction = process.env.ELEVENTY_ENV === "production";
const outputDirectory = isProduction ? "docs" : "dev";

// Note: this site has no local stylesheet build (no Sass, no content-hashed
// CSS asset) — styling is Tailwind loaded from a CDN <script> in
// base.njk, plus a small hand-written css/site.css for the bits Tailwind
// utilities don't cover (SVG icon strokes, the leaf-divider shapes). See
// README.md for why, compared to the other examples' Sass build.

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);
  // Note: @quasibit/eleventy-plugin-sitemap builds <loc> via `new URL(page.url,
  // hostname)`, which drops any path segment in `hostname` (root-relative
  // page.url resolves against the origin only) — fine for a client site on
  // its own domain, but wrong for this demo's GitHub Pages project URL. See
  // src/sitemap.xml.njk, which builds the sitemap manually instead of using
  // this plugin's hostname, for that reason.
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://sebastiansells13-bot.github.io",
    },
  });

  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.ignores.add("**/.DS_Store");
  eleventyConfig.watchIgnores.add("**/.DS_Store");
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy")
  );

  eleventyConfig.addFilter("htmlDateString", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd")
  );

  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) return array.slice(n);
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("slugify", (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  });

  eleventyConfig.addFilter("money", (n) => "$" + Number(n).toFixed(2));
  eleventyConfig.addFilter("json", (obj) => JSON.stringify(obj));

  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addPassthroughCopy({ "src/_includes/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/_includes/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/_includes/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/_includes/favicons": "favicons" });
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({ class: "direct-link", symbol: "#" }),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    // GitHub Pages project site (no custom domain) serves this at
    // /terra-and-table-example/, so every root-relative href/src needs that
    // prefix. Eleventy's bundled html-base-plugin (registered via the RSS
    // plugin above) rewrites them automatically based on this value — a
    // client site on its own domain would just use "/".
    pathPrefix: "/terra-and-table-example/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: outputDirectory,
    },
  };
};
