import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import { HtmlBasePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import Image from "@11ty/eleventy-img";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import EleventyPluginRobotsTxt from "eleventy-plugin-robotstxt";
import { rssPlugin } from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";
import markdownItAbbr from "markdown-it-abbr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const siteData = require("./src/_data/site.json");

export default function(eleventyConfig) {
  const md = markdownIt({ html: true }).use(markdownItFootnote).use(markdownItAbbr);
  eleventyConfig.setLibrary("md", md);
  const pathPrefix = process.env.PATH_PREFIX || "/";

  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(EleventyPluginRobotsTxt, {
    shouldBlockAIRobots: true,
    sitemapURL: `${siteData.url}${pathPrefix}sitemap.xml`,
    rules: new Map([
      [["AhrefsBot", "SemrushBot", "DotBot", "MJ12bot", "DataForSeoBot"], [{ disallow: `${pathPrefix}` }]],
      ["*", [{ disallow: `${pathPrefix}quotes/` }]],
    ]),
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["jpeg"],
    widths: [400, 800, 1200, "auto"],
    defaultAttributes: {
      sizes: "(max-width: 800px) 100vw, 800px",
      loading: "lazy",
      decoding: "async",
    },
  });

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({
    "node_modules/photoswipe/dist/photoswipe.css": "assets/css/photoswipe.css",
    "node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js": "assets/js/photoswipe-lightbox.esm.min.js",
    "node_modules/photoswipe/dist/photoswipe.esm.min.js": "assets/js/photoswipe.esm.min.js",
  });

  eleventyConfig.addPairedAsyncShortcode("gallery", async function(content) {
    const images = content.trim().split("\n")
      .map(line => line.trim()).filter(Boolean)
      .map(line => {
        const [src, ...rest] = line.split("|").map(s => s.trim());
        return { src, alt: rest.join("|") || "" };
      });

    const items = await Promise.all(images.map(async ({ src, alt }) => {
      const inputPath = path.join(__dirname, "src", src);
      const stats = await Image(inputPath, {
        widths: [400, "auto"],
        formats: ["jpeg"],
        outputDir: path.join(__dirname, "_site/img/"),
        urlPath: "/img/",
        filenameFormat: (id, src, width) => {
          const ext = path.extname(src).slice(1);
          return `${id}-${width}.${ext}`;
        },
      });
      const thumb = stats.jpeg.find(s => s.width === 400) || stats.jpeg[0];
      const full = stats.jpeg[stats.jpeg.length - 1];
      return { thumb, full, alt };
    }));

    const thumbsHtml = items.map(({ thumb, full, alt }) =>
      `<a href="${full.url}" data-pswp-width="${full.width}" data-pswp-height="${full.height}" target="_blank">` +
      `<img src="${thumb.url}" width="${thumb.width}" height="${thumb.height}" alt="${alt}" ` +
      `class="w-full h-auto border border-arcade-magenta hover:border-arcade-yellow transition-colors" ` +
      `loading="lazy" decoding="async" eleventy:ignore>` +
      `</a>`
    ).join("\n");

    return `<div class="pswp-gallery grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 not-prose">\n${thumbsHtml}\n</div>`;
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  eleventyConfig.addShortcode("buildYear", () => new Date().getFullYear());

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (tag !== "all" && tag !== "post") tagSet.add(tag);
      });
    });
    return [...tagSet].sort();
  });

  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html", "11ty.js", "11ty.mjs"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
