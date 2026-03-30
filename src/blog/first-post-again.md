---
title: Hello, world... again
date: 2026-03-30
description: Relaunching my personal site after years of neglect.
tags:
  - coding
  - rebirth
  - website
  - omphaloskepsis
---

My previous personal webpage was written in 1998 as a bunch of `<UL>` and `<LI>` and then... never really changed. I had
some super old projects that I barely remember, and other things about me that maybe made sense back then that don't
now. Occasionally I'd add some metadata or a link to something and eventually added Wordpress as a blog when that was a
hot thing to do. My needs have changed, I don't need as dynamic a blog, and comments sections are just a nuisance in
2026. It was time to start over with up update to modern web standards and amazing _new magic stuff_ like CSS.

My needs these days are met very well by a static site generator. On the blog side, I did have some requirements like
being able to share syntax color highlighted code and using tags for some sort of organization/sorting. I also knew I
wanted to highlight coding projects I've done, have a resume page to help me with continued employment, and a few other
minor things. The problem was just getting started and sitting down and doing something.

To be honest, this is my second or third attempt in about 2 years of redoing the site. The big obstacles were 1) time
and 2) I wanted to use building the new site as a forcing function to get better with the AI tools that have stormed the
industry. My first two attempts did not go well, I ended up with the AI stomping on its own dick, it not really
understanding what I wanted from a layout, and other things that just frustrated me. What a difference even just 6
months makes with these tools.

## Tool choice

After hearing good things about [11ty](https://www.11ty.dev) from one of my favorite podcasters, I did some reading and
it seemed to fit the bill. The next step was picking a CSS library that was easy to use.

I had [tailwindcss](https://tailwindcss.com) recommended to me by a strong front-end engineer I worked with, so that has
been my default choice.

As mentioned above, I also wanted to use some AI tooling to get going. My initial pass has all been using [Claude
Code](https://code.claude.com/docs/en/overview).

## Process so far

My goal was to have Claude help me with all the plumbing and CSS and other things I'm not super good at, while any of
the content, such as this post you're reading now, be authored by me. (Maybe with a grammar check pass.)

I was surprised at how quickly I was able to get Claude to set up an 11ty structure, do a basic layout that I like, and
follow my instructions on the sections I wanted, add responsive design, and include some important creature comforts
like a `robots.txt` and `sitemap.xml`.

It generated a placeholder "first post" blog post that I've tossed out, but I also used claude to migrate a few posts
from my old Wordpress based blog before I tore it down, mostly to kick the tires and get everything installed for code
syntax highlighting. That went really well and I'm leaving those migrated posts around, at least for now, to maintain
some of my old content.

## What's next?

I guess I start doing more blogging and trying to keep it up to date. We'll see. I have some free time currently, so it
might be a good time to document my home network.
