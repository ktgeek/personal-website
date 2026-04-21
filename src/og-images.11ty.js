"use strict";

const path = require("path");
const fs   = require("fs");

const WIDTH  = 1200;
const HEIGHT = 630;

const BG     = "#0a0a0f";
const YELLOW = "#ffe600";
const CYAN   = "#00f5ff";
const DIM    = "#8888aa";
const BORDER = "#2a2a3a";

module.exports = class OgImages {
  data() {
    return {
      pagination: {
        data: "collections.post",
        size: 1,
        alias: "post",
        addAllPagesToCollections: false,
        before: (posts) => [null, ...posts],
      },
      permalink: ({ post }) =>
        post ? `assets/og/${post.fileSlug}.png` : `assets/og/default.png`,
      eleventyExcludeFromCollections: true,
    };
  }

  async render({ post, site }) {
    const { default: satori } = await import("satori");
    const sharp = require("sharp");

    const fontData = fs.readFileSync(
      path.join(__dirname, "assets/fonts/press-start-2p-latin-400-normal.woff")
    );

    const title = post ? post.data.title : site.name;
    const titleFontSize =
      title.length > 50 ? 28 :
      title.length > 30 ? 36 : 44;

    const element = {
      type: "div",
      props: {
        style: { display: "flex", width: WIDTH, height: HEIGHT, backgroundColor: BG },
        children: [
          // Left yellow stripe
          {
            type: "div",
            props: {
              style: { display: "flex", width: 10, backgroundColor: YELLOW, flexShrink: 0 },
              children: "",
            },
          },
          // Main content area
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "60px 70px",
                justifyContent: "space-between",
              },
              children: [
                // Top: site name
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      color: DIM,
                      fontFamily: '"Press Start 2P"',
                      fontSize: 13,
                      letterSpacing: 2,
                    },
                    children: "KEITH T. GARNER",
                  },
                },
                // Middle: post/page title
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      color: YELLOW,
                      fontFamily: '"Press Start 2P"',
                      fontSize: titleFontSize,
                      lineHeight: 1.6,
                      flexGrow: 1,
                      alignItems: "center",
                      maxWidth: 1000,
                    },
                    children: title,
                  },
                },
                // Bottom: domain + CTA
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTopWidth: 1,
                      borderTopStyle: "solid",
                      borderTopColor: BORDER,
                      paddingTop: 24,
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: { color: CYAN, fontFamily: '"Press Start 2P"', fontSize: 13 },
                          children: "kgarner.com",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: { color: CYAN, fontFamily: '"Press Start 2P"', fontSize: 13 },
                          children: "READ >",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };

    const svg = await satori(element, {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: "Press Start 2P", data: fontData, weight: 400, style: "normal" }],
    });

    return sharp(Buffer.from(svg)).png().toBuffer();
  }
};
