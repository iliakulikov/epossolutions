# Old-to-new URL plan

| Old URL | Destination | GitHub Pages handling |
|---|---|---|
| `/home/` | `/` | Static zero-second redirect fallback |
| `/home-page/` | `/` | Static zero-second redirect fallback |
| `/home-page-2019/` | `/` | Static zero-second redirect fallback |
| `/about-us/` | `/about-us/` | Retained as a crawlable page |
| `/about.html` | `/about-us/` | Host-level 301 in `_redirects`; update internal links |
| `/contact-us/` | `/contact-us/` | Retained as a crawlable page with form |
| `/book-a-demo/` | `/contact-us/` | Static redirect fallback; host-level 301 in `_redirects` |
| `/request-a-quote/` | `/contact-us/` | Static redirect fallback; host-level 301 in `_redirects` |
| `/epos-retail-solutions/` | Same URL | Retained as a crawlable retail landing page |
| `/hospitality-epos-solutions-utm-gads/` | Same URL | Retained as a crawlable hospitality landing page |
| `/what-are-epos-systems/` | Same URL | Retained as a crawlable guide |
| `/choosing-an-epos-system/` | Same URL | Retained as a crawlable guide |

`_redirects` supplies real 301 responses on Cloudflare Pages or Netlify. GitHub Pages ignores it, so important same-URL pages exist physically and redirect-only routes have HTML fallbacks. Add additional URLs only after checking Search Console performance, links and indexed-page exports.
