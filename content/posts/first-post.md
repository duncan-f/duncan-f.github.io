---
title: "How to host a website with nginx"
date: 2022-07-16T16:57:10+03:00
author: "Farouk Mokhtari"
thumbnail: "post-1.jpg"
draft: true
---

# Introduction

If you ended up reading this article, it means that you wanna start your own
webserver but you don't know where to begin. Don't panic! There's nothing really
hard in the process of getting it done, but there's some requirements you should
have before hand.

### Requirements

- An old computer that lies down in you house.
- A little knowleadge of the linux OS.

# Let's get started

First, you need to install Linux on your computer. I prefer
[Debian](https://debian.org) distribution, because it's stable. But you can use
any other linux distribution if it suits you, you can install for example
[Ubuntu Server](https://ubuntu.com).

I'm not gonna go through the process of installing Linux on your computer, you
can find plenty of videos on YouTube that explains the process step-by-step.

## Install nginx

You have to install **nginx** on your server:

- Debian / Ubuntu:

{{< highlight shell >}} sudo apt install nginx {{< / highlight >}}

- Archlinux-based distributions:

{{< highlight shell >}} sudo pacman -S nginx {{< / highlight >}}

To be continued...
