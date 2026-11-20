# Rahul S portfolio

A buildless portfolio made with HTML and CSS. Project disclosures and section links work without JavaScript. Local JavaScript opens project deep links, marks the current section, and updates the reading progress and career timeline as you scroll. The animations respect reduced-motion preferences.

## Preview

Run `python -m http.server 8000` in this directory and visit <http://localhost:8000/>. Edit `index.html` for portfolio content and `styles.css` for the page design.

## Publish on GitHub Pages

1. Push the site files to a GitHub repository. The local `reference/` folder is ignored by Git. It contains the original résumé, career screenshot, and photos. The web-ready versions of the photos are included in `assets/`.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the branch containing the site, choose **/ (root)**, and save.

The site uses relative asset paths, so it works at both an account site and a project subpath. After GitHub assigns a public URL, update `og:image` in `index.html` to the absolute URL of `assets/share.jpg` for social previews.
