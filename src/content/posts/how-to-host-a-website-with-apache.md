---
title: How to host a website with Apache
description: This is tutorial is going to help you setup a webserver accessible
  remotly from the internet.
category: Tutorial
author:
  name: Farouk Mokhtari
  email: fmokhtari@mail.ru
  website: https://fmokhtari.com
  btc: 1JJmuidSTRCugnBKH8H7bDxEmTtAAg4kyn
  usdt: TWi6yNRhxzkmgZhhoriDzWgvrSsxbdQCb8
  xmr: 87Asjp2TLCkKnw3PYsiKaTDwL8mNhiL7uV67ptCtVxqbSnaZfATQ6t4d1mfWnKu4kB4ieQHMApGhUdUY3h4RKBS2Kuc5RyW
tags:
  - server
  - apache
  - linux
  - web
date: 2022-07-16T13:57:06.410Z
---
## Introduction

Building a web server on Linux can be a great way to repurpose an old computer
and host your own websites or applications. In this tutorial, I will guide you
through the process of building this web server using an old computer running
Linux, including which operating system to install, which packages to install,
and how to host it for the internet.

Don't panic! There's nothing really hard in the process of getting it done, but
there are some requirements you should have before hand.

### Requirements

* An old computer you have in your house.
* A little knowledge of the Linux OS.
* A basic knowledge about Networks.

## Let's get started
First, you need to install an operating system on your computer. Popular
choices for web servers include Ubuntu Server, CentOS, and Debian. For this
tutorial, we will use [Ubuntu Server](https://ubuntu.com). I chose Linux, why
Linux ? Because Linux is best suited for servers.

I'm not gonna go through the process of installing Linux on your computer, you
can find plenty of videos on YouTube that explains the process step-by-step.

After installation is complete and you have logged in, open a terminal window
by pressing Ctrl+Alt+T (or search for "Terminal" in the Applications menu).

Update your system by running these commands:
```
sudo apt update
sudo apt upgrade
```
## Install tools
To build our web server, we need to install several packages:

1. Apache HTTP Server - A popular open-source web server.
2. MySQL or MariaDB - A relational database management system (optional).
3. PHP - A programming language used for dynamic content generation.
4. phpMyAdmin (optional) - A web-based interface for managing MySQL databases.

Install these packages by running:
```
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql phpmyadmin
```

During installation of MySQL/MariaDB and phpMyAdmin, you will be prompted to
set a password for the root user.

## Configure Apache
Apache is now installed, but we need to configure it properly. Open the Apache
configuration file in a text editor:
```
sudo nano /etc/apache2/apache2.conf
```

Add the following line at the end of the file:
```
ServerName your_domain_or_IP_address
```

Save and exit the file by pressing Ctrl+X, followed by Y and Enter.

Next, enable necessary modules with these commands:
```
sudo a2enmod rewrite
sudo systemctl restart apache2
```

Type this command to get the IP address of your server:
```
ip addr
```

After getting the IP of your server you can connect to the same network where
your server is connected with your laptop or your phone, go to your browser
then type your IP address.

Generally it's 192.168.X.X and then you'll get a page like this

![Apache2 Ubuntu Default Page](https://assets.digitalocean.com/articles/varnish/apache_default.png)

## Configure MySQL/MariaDB (optional)
If you installed MySQL or MariaDB earlier and want to use it with your web server:

Configure MySQL/MariaDB for secure installation by running this command:
```
sudo mysql_secure_installation
```
Follow the prompts to set up security options such as removing anonymous users
and disallowing remote root login.

## Install PHPMyAdmin (optional)
If you want to install phpMyAdmin for managing databases through a graphical interface:

During installation of phpMyAdmin, choose "apache2" when asked which web server
should be configured automatically.

After installation, open `phpmyadmin.conf` using this command:
```
sudo nano /etc/apache2/conf-available/phpmyadmin.conf
```

Within this file, find `<Directory /usr/share/phpmyadmin>` section and
add `AllowOverride All` just below `Require all granted`.

Save and exit the file by pressing Ctrl+X, followed by Y and Enter.

Enable the changes by running:
```
sudo a2enconf phpmyadmin
sudo systemctl restart apache2
```

## Host Your Web Server for the Internet
To make your web server accessible from the internet, you will need to
configure port forwarding on your router. Consult your router's manual or
search online for instructions specific to your router model.

Forward incoming traffic on port 80 (HTTP) and/or port 443 (HTTPS) to the local
IP address of your web server.

You may also want to consider obtaining a domain name and pointing it to your
public IP address using DNS services like Cloudflare or No-IP.

## Configure Firewall (optional)
It is recommended to configure a firewall on your web server for added security.
Ubuntu Server comes with UFW (Uncomplicated Firewall) installed by default.

To enable UFW, run these commands:
```
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http/tcp   # if not already allowed during installation of Apache
sudo ufw allow https/tcp  # if not already allowed during installation of Apache

# Allow other necessary ports depending on additional services you plan to use.
```

>Make sure you understand how firewalls work before making any changes.
>Incorrect configurations can lock you out of your own system.

Congratulations! You have successfully built a Linux-based web server using an
old computer. Now you can start hosting websites or applications on it.
Remember to keep the system updated with security patches regularly and follow
best practices for securing a web server.
