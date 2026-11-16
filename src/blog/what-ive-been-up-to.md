---
title: "What I've been up to lately..."
date: 2026-11-15
description: "Updates since August: consulting work, AI-assisted side projects, openHAB and open-source contributions, a bias-lighting rebuild, and DNS over HTTPS."
tags:
  - ai
  - mcp
  - coding
  - home-automation
  - openhab
  - home-network
  - ruby
  - diy
  - open-source
---

When I rebuilt the website, I had intended to post more and breathe some life into the blog. Of course, reality has a
way of dropping writing down the priority list. Here's a quick roundup of some notable things I've been up to since
August.

## Work

As I shared on LinkedIn, I've started consulting while I keep looking for a full-time role. My current client is a
part-time gig where I work as a software engineer. I've primarily been working on their LTI[^1] integration. The nice
part is that it's let me dig into the current slate of AI tools as an independent contributor, something I haven't had
to do in leadership. When I make it back into a leadership role, this will give me a better-informed opinion.

As they say, "action begets action": this work inspired a bunch of small personal projects.

## Projects

### [ruby-band-mcp-server](https://github.com/ktgeek/ruby-band-mcp-server)

My scout troop uses [Band](https://band.us/) to communicate, and one of my tasks as Scoutmaster is to post
announcements and reminders to the troop. In an effort to get more attention and readership, I'd been using Claude to
help me format and emoji up the announcements. For the most part that ended up being a lot of cutting and pasting and
formatting work, so I figured I'd let Claude do the work for me.

Working with Claude, I created the uncreatively named
[ruby-band-mcp-server](https://github.com/ktgeek/ruby-band-mcp-server), an MCP server that gives agents access to the
Band API. Band's API is pretty poor, but it has enough to get the job done and saves me a bunch of time every week. All
you need is an API key from Band, and you can run it on bare-metal Ruby or in the Docker container I also released.

### AWTRIX NG openHAB support

I have a couple of [Ulanzi TC001 Smart Pixel Clocks](https://www.ulanzi.com/products/ulanzi-pixel-smart-clock-2882)
around the house to share the time, outdoor temperature, notifications, and the open/lock status of the house perimeter.
(I need to add some more data, but the outdoor temp was most pressing for biking.) I had been running
the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
Licensed](https://creativecommons.org/licenses/by-nc-sa/4.0/) [Awtrix 3](https://blueforcer.github.io/awtrix3/#/)
firmware on the clocks, but the author has discontinued it and moved on to [AWTRIX
NG](https://blueforcer.github.io/awtrix-ng/) which has [some breaking
changes](https://blueforcer.github.io/awtrix-ng/esp32/guides/migrating-from-awtrix3/), some more hardware support, and a
[new non-commercial license](https://polyformproject.org/licenses/noncommercial/1.0.0).

To send data to the clocks on Awtrix 3 I had been using the [Awtrix 3 openHAB
binding](https://www.openhab.org/addons/bindings/mqtt.awtrixlight/), but with all the changes that wouldn't work with
AWTRIX NG. Working with Claude Code, I put together a whole new add-on just for the NG branch, but the openHAB
maintainers pointed out that it would be a third add-on just for AWTRIX NG. I reworked it to build on top of the Awtrix 3
binding, which actually worked better: I could code up a one-way upgrade path from Awtrix 3 to AWTRIX NG and build in a
lot of backwards compatibility for function calls so people wouldn't need to rewrite their automation rules. After
testing it locally for a bit, it's [up as a PR](https://github.com/openhab/openhab-addons/pull/22282).

### Getting rspec working for openhab-jruby

After some of the awtrix changes, I got inspired to fix up the [unit tests for my home automation
rules](https://github.com/ktgeek/openhab-stuff/tree/main/config/spec). I had a number of problems getting them to run,
so I worked through the problems and made local workarounds, but [opened
issues](https://github.com/openhab/openhab-jruby/issues?q=is%3Aissue+author%3Aktgeek) with the main openhab-jruby repo.

I know both maintainers, one personally and the other via Slack, so I told them I'd take some ownership of the issues.
That turned into [two merged
PRs](https://github.com/openhab/openhab-jruby/pulls?q=is%3Apr+state%3Aclosed++author%3Aktgeek) to the project.

I'm going to work through more of the issues I've opened over the next couple of weeks.

### Fixing my monitor bias lighting

For years, an LED strip affixed to the back of my monitor has provided bias lighting, driven by an LED controller and
[hyperion.ng](https://github.com/hyperion-project/hyperion.ng). When I first put it together, I had no idea what I was
doing, so I just bent the strip around the corners. Eventually the controller died, and the LED strip started to act
weird, which I'm guessing is from heat exposure over time.

Using the soldering skills I learned at the [National Jamboree](https://jamboree.scouting.org) [STEM
tent](https://flic.kr/p/2ss4DZy), I did a proper job of soldering the corners and I replaced the weird USB controller
with an ESP8266 controller running [WLED](https://kno.wled.ge). With Hyperion running in a container on my home server
and the `hyperion-osx` screen-capture helper on my laptop, I'm back up and running just in time for the earlier sunsets
of winter, when the bias lighting is the most useful.

{% gallery %}
/assets/images/blog/bias-lighting-monitor.jpg | The monitor with the LEDs affixed, reflecting the screen
/assets/images/blog/bias-lighting-runtime.jpg | The bias lighting at work, with the image on the monitor "reflecting" on the wall behind it
{% endgallery %}

The physical part of the project took the better part of a day as I worked through some soldering kinks. Gotta keep
practicing so I can speed up.

I also found a bug in `hyperion-osx` which was causing the app to shut down right away, so I [submitted a
PR](https://github.com/hyperion-project/hyperion.ng/pull/2076) with a fix.

### DNS over HTTPS (DoH) on the LAN

This warrants its own write-up in a separate blog post in the near future... but I turned on DNS over HTTPS on my
local instance of AdGuard Home, and figured out how to have DHCPv4 and DHCPv6 tell clients about it. One of those
"because I could" projects instead of "because it provides any real value."

### [troop-rsvp-app-script-helper](https://github.com/ktgeek/troop-rsvp-app-script-helper)

A couple of years ago, I wrote a [bunch of code](https://github.com/ktgeek/troop-rsvp-app-script-helper) to use in
Apps Script in Google Sheets to help me manage campouts after the Google Form RSVPs are filled in. As I get ready to hand
the reins to someone else, I made a bunch of updates to the scripts: 1) they're easier to edit and deploy, to both
existing sheets and new ones; 2) they're more robust, keying into columns by header instead of by position; and 3) I
added some reasonably attractive printing options for use on the go instead of just printing the ugly spreadsheets.

### Food

I worked up a good brining recipe for smoking thick pork chops. I usually smoke them a couple of days before we go to
camp. While camping, one dinner is those pork chops warmed up and finished over the open fire. It worked out marvelously
while camping over Labor Day. I'll post the recipe in a future blog post.

[^1]: [Learning Tool Interoperability](https://www.1edtech.org/standards/lti) is a standard that connects external
    learning tools with Learning Management Systems (LMS) so users can launch apps seamlessly inside their courses
    without separate logins.

*[LTI]: Learning Tool Interoperability
*[MCP]: Model Context Protocol
