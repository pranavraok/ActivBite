# Tusker Grotesk 6700 Bold — Website Integration Kit

This is a legal, drop-in webfont integration kit for your website.
It **does not include the Tusker Grotesk font files**. Tusker Grotesk is a commercial typeface, so you need a valid webfont license and the licensed webfont files before using it on a live website.

## Folder structure

```text
tusker-grotesk-6700-bold-website-kit/
├─ css/
│  └─ tusker-grotesk-6700-bold.css
├─ fonts/
│  └─ PUT_LICENSED_FONT_FILES_HERE.txt
├─ examples/
│  └─ index.html
└─ server/
   ├─ apache-font-mime.htaccess
   └─ nginx-font-mime.conf
```

## Setup

1. Buy or download the licensed **webfont** package for **Tusker Grotesk 6700 Bold**.
2. Copy the licensed files into `/fonts/` using these names:

```text
fonts/TuskerGrotesk-6700Bold.woff2
fonts/TuskerGrotesk-6700Bold.woff
```

The `.woff2` file is the important modern web format. The `.woff` file is only a fallback.

3. Add the CSS to your site:

```html
<link rel="stylesheet" href="/path-to-kit/css/tusker-grotesk-6700-bold.css">
```

4. Use it:

```css
.hero-title {
  font-family: var(--font-tusker-6700-bold);
  font-weight: 700;
  line-height: 0.86;
  letter-spacing: -0.015em;
  text-transform: uppercase;
}
```

or directly:

```html
<h1 class="tusker-hero">Your Big Headline</h1>
```

## Troubleshooting

If the font does not load:

- Check the browser DevTools Network tab for `404` errors.
- Confirm the file is named exactly `TuskerGrotesk-6700Bold.woff2`.
- Confirm the relative path in `@font-face` matches your deployed folder structure.
- Confirm your web server sends correct MIME types for `.woff2` and `.woff`.
- Confirm your license allows self-hosting on your website/domain.

## License note

This kit is not a font license and contains no font binaries. Use only licensed Tusker Grotesk files supplied by the font vendor/foundry.
