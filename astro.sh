#!/bin/bash

[ -z "$1" ] && echo "You have to give it a title!" && exit 1
title=$1
slug=$(echo $1 | iconv -t ascii//TRANSLIT | sed -r 's/[^a-zA-Z0-9]+/-/g' | sed -r 's/^-+\|-+$//g' | tr A-Z a-z)

[ ! -n "$filepath" ] && mkdir -p "src/content/posts/"
filepath="src/content/posts/${slug}.md"

content=$(
	cat <<EOF
---
title: "${title}"
description: ""
date: $(date --iso-8601=seconds)
draft: true
---

EOF
)

echo "$content" >"$filepath"

echo "File created successfully at $filepath"
