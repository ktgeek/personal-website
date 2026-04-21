---
title: "Documenting the home network"
date: 2026-04-21
description: A 10,000 ft view of my home network — the first post in a series going deep on each component.
tags:
  - documentation
  - home-automation
  - home-network
  - linux
  - networking
  - openhab
  - openwrt
  - self-hosted
---

## Motivation

Between wireless access points, the firewall, home automation, and general file serving, I have a lot going on with my
home network. Should something happen to me, it would run for a while, but eventually the family would need someone's
help to fix anything that goes wrong. That person would probably need to know what is here. So I should probably write
it all down.

Over the next few weeks, I'll be writing more detailed posts about each of the components with the aim of knowledge
sharing, but not blowing a hole in my security by sharing too much. I'm not sure how long this series of posts will be,
I'm as excited to find out as you are!

But let's start with the...

## 10,000 ft view

I thought I'd start with a high level overview of everything that is running. In later posts, I'll go into detail about
each part. (I'll also come back to this post and add links to the more detailed posts as I write them.)

### Firewall

My firewall is an x86_64 based box running a custom build of OpenWRT. Besides adding and removing packages from the
default public distribution, I also bake my configuration directly into the image. From OpenWRT I get lots of core
network necessities like IPv4 and IPv6 routing and firewalling, DHCP for v4 and v6, and more I'll cover in a later post.

I also take advantage of the fact that OpenWRT is just Linux by running a bunch of extra services on the firewall within
LXC and Docker containers. Among those services is the core of my home automation, AdGuard Home, and a couple of others.

This is also the source of two VLANs I run throughout the house. A home VLAN for myself and the family, and a guest VLAN
for visitors. Eventually I will add a third VLAN for IoT devices, but I have been lazy about it for something like 3
years.

### Access points

I have three access points throughout the house located in "places I'm often at and often want excellent wifi signal."
Those places are the home office, the family room, and the basement entertainment center. The access points also run a
custom build of OpenWRT where I've stripped them down to just being access points. The firewall connects directly to
them via ethernet that runs through the house, trunking the VLANs to them.

I also have one travel access point that has been configured to use WDS to bridge the network to ethernet to our laser
printer. For some reason that printer tends to fall off the network when it's on wifi, so this is a workaround to keep
it connected.

### Home automation

My home automation is built around OpenHAB. I have a mix of Zigbee, Z-Wave, Tasmota, and ESPHome devices with some
one-off technologies here and there. When OpenHAB doesn't have a direct integration (or when it's not good), OpenHAB and
the various devices talk to each other through MQTT. Because OpenHAB is running on the firewall, my Zigbee and Z-Wave
dongles are connected to it. I expose devices from OpenHAB to HomeKit through the HomeKit and Matter integrations.

### Network Clients

Outside of the wifi based home automation devices, the user devices on the network are a mix of Windows, Linux machines,
and MacBooks. The two Windows machines on the network are Sarah's work laptop and Evan's gaming PC. I have a miniPC
running Linux that serves as a file and media server. My Linux desktop is more of a gaming console at this point,
running the Bazzite Linux distribution. Our TVs have AppleTVs hooked up to them and there is a PS5 and Switch in the
basement. The rest of the devices are iPhones and iPads.

## More to come

I'm sure there are some things I've left out in this post, but that's what the later posts in the series are for. We'll
deep dive into each part I think deserves it and share what I can about how I've configured things. First up will
probably be the core firewall itself which I suspect will end up being multiple parts as there is a lot going on there.

*[WDS]: Wireless Distribution System
*[IoT]: Internet of Things
