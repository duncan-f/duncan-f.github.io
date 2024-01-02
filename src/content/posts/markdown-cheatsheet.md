---
title: Markdown Cheatsheet
description: This cheatsheet covers both the basic and advanced features of Markdown syntax.
category: General
author:
  name: Farouk Mokhtari
  email: fmokhtari@mail.ru
  website: https://fmokhtari.com
  btc: 1JJmuidSTRCugnBKH8H7bDxEmTtAAg4kyn
  usdt: TWi6yNRhxzkmgZhhoriDzWgvrSsxbdQCb8
  xmr: 87Asjp2TLCkKnw3PYsiKaTDwL8mNhiL7uV67ptCtVxqbSnaZfATQ6t4d1mfWnKu4kB4ieQHMApGhUdUY3h4RKBS2Kuc5RyW
tags:
  - lesson
date: 2023-08-05T17:11:50.172Z
---

## Headers:

```
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------
```

# H1

## H2

### H3

#### H4

##### H5

###### H6

Alternatively, for H1 and H2, an underline-ish style:

# Alt-H1

## Alt-H2

## Emphasis:

```
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Strikethrough this.~~
```

Emphasis, aka italics, with _asterisks_ or _underscores_.

Strong emphasis, aka bold, with **asterisks** or **underscores**.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Strikethrough this.~~

## Lists:

### Unordered list:

```
- Item 1
- Item 2
- Item 3
```

- Item 1
- Item 2
- Item 3

### Ordered list:

```
1. First item
2. Second item
3. Third item
```

1. First item
2. Second item
3. Third item

## Links and Images:

```
[Inline Link](https://www.example.com)

[Inline Link with title](https://www.example.com "Example")
```

[Inline Link](https://www.example.com)

[Inline Link with title](https://www.example.com "Example")

```
![Image](image.jpg)
```

![Image](/images/coding.jpg)

## Code Blocks and Inline Code:

### Inline code:

```
You can display inline `code` using backticks.
```

You can display inline `code` using backticks.

### Code block:

You can put your code between ` ``` ` to display a block of code.

```javascript
// Code block example
function example_function() {
  console.log("This is a code block");
}
```

```python
# Code block example
hello = "Hello, world!"
print(hello)
```

```
This is just a basic block of code without any highlighting.
```

## Blockquotes:

```
> This is a blockquote.
>
> It can span multiple lines.
```

> This is a blockquote.
>
> It can span multiple lines.

## Horizontal Rule:

You can get the horizontal rule with asterisks **\*** underscores **\_** and hyphens **-** like so.

```
---
```

---

## Tables:

```
| Column 1 | Column 2 |
| -------- | -------- |
| Data | Data |
| Data | Data |
```

| Column 1 | Column 2 |
| -------- | -------- |
| Data     | Data     |
| Data     | Data     |

## Escape Characters:

```
\* Asterisks *
\\ Backslash \
\` Backtick `
\_ Underscore _
\{\} Curly braces {}
\[\] Square brackets []
\(\) Parentheses ()
\# Hash mark #
\+ Plus sign +
\- Minus sign/hyphen -
\. Dot/period .
```

## Advanced Features:

### Task Lists:

```
- [x] Task completed.
- [ ] Task incomplete.
```

Output :

- [x] Task completed.
- [ ] Task incomplete.

### Footnotes:

```
Here is some text with a footnote[^1] and another one with [^text].

[^1]: This is the footnote content.
[^text]: This is another content for the footnote.
  This can be multi-line footnote.
```

Here is some text with a footnote[^1] and another one with [^text].

[^1]: This is the footnote content.
[^text]:
    This is another content for the footnote.
    This can be multi-line footnote.

### Abbreviations:

```
The HTML abbreviation tag is <abbr title="Hypertext Markup Language">HTML</abbr>.
```

The HTML abbreviation tag is <abbr title="Hypertext Markup Language">HTML</abbr>.

### Highlighting text:

```
This is a ==highlighted text==.
```

This is a ==highlighted text==.

### Definition Lists:

```
Term 1
: Definition for Term 1

Term 2
: Definition for Term 2
```

Term 1
: Definition for Term 1

Term 2
: Definition for Term 2

### Mathematical Formulas:

#### Inline formula:

```
$E=mc^2$
```

$E=mc^2$

#### Block formula:

```
$$
E=mc^2
$$
```

$$
E=mc^2
$$
