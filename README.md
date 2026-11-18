# hammad.dev

A lightweight personal portfolio and technical journal for GitHub Pages. It uses plain HTML, CSS, and JavaScript: no build step, package manager, or backend is required.

## Run locally

Open `index.html` in a browser, or serve the folder with any static file server.

## Publish with GitHub Pages

In the repository settings, open **Pages**, choose **Deploy from a branch**, then select the branch and `/ (root)` folder that contain `index.html`. The site is static and can also be hosted on any static web host.

## Update the site

- Edit the intro and About copy directly in `index.html`.
- Update learning areas in the three `.field-row` sections. Keep the wording framed as areas of interest and learning.
- Add real project cards to the Projects section only after a project is ready to share. Copy `_templates/project-detail.html` to `projects/<project-slug>/index.html`, replace the bracketed fields, and link the card to that page. Include the repository, methods, data source, findings, and lessons that apply; remove sections that do not.
- Add published technical notes in the same way using `_templates/note-detail.html`. Link each note from the notebook area and only publish content that is ready to read.
- When a deployment exists, replace the Coming soon copy with its description and live demo, documentation, source, and model links.
- Social profiles and email are collected in the footer and contact area.

The `_templates` directory is intentionally excluded from GitHub Pages by Jekyll. Copy a template into the public `projects/` or `notes/` directory when creating a real entry.

## Files

- `index.html` — page content and semantic structure
- `styles.css` — palette, responsive layouts, and shared visual styles
- `script.js` — mobile navigation, active section state, and current footer year
- `_templates/` — unlisted starter pages for future project and note entries

## Palette

- Navy `#14213D`
- Cream `#F4EDE0`
- Coral `#FF6B5B`
