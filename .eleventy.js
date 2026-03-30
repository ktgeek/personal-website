const { HtmlBasePlugin } = require("@11ty/eleventy");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const EleventyPluginRobotsTxt = require("eleventy-plugin-robotstxt");
const { rssPlugin } = require("@11ty/eleventy-plugin-rss");
const siteData = require("./src/_data/site.json");

module.exports = function(eleventyConfig) {
  const pathPrefix = process.env.PATH_PREFIX || "/";

  eleventyConfig.addPlugin(HtmlBasePlugin);
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
  eleventyConfig.addPassthroughCopy("src/assets");

  // Date filters for blog posts
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

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
