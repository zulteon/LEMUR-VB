# Lemur VB

Next.js alapú, markdown fájlokból épülő blog.

## Indítás

```bash
npm install
npm run dev
```

Ezután nyisd meg: `http://localhost:3000`

Windows alatt használhatod a `start.bat` fájlt is.

## Feltöltés GitHubra

Windows alatt futtasd az `upload-github.bat` fájlt. Ez commitolja a változásokat, majd feltölti a `main` branchre:

```text
https://github.com/zulteon/LEMUR-VB
```

## Új bejegyzés hozzáadása

Hozz létre egy új `.md` fájlt a `posts` mappában:

```md
---
title: "A cikk címe"
date: "2026-06-12"
excerpt: "Rövid leírás a kártyára."
tags: ["téma", "jegyzet"]
---

## Alcím

A cikk tartalma markdownban.
```

A fájlnév lesz az URL slug. Például: `uj-cikk.md` -> `/blog/uj-cikk`.
