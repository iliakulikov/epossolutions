function getParameterByName(name, url) {
  const source = url || window.location.href;
  const escaped = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + escaped + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(source);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function toggleMenu() {
  const mobileNav = document.getElementById("mobile-nav");
  const menuButton = document.querySelector(".menu-toggle");

  if (!mobileNav) {
    return;
  }

  mobileNav.classList.toggle("active");

  if (menuButton) {
    const expanded = mobileNav.classList.contains("active");
    menuButton.setAttribute("aria-expanded", expanded ? "true" : "false");
  }
}

function initSmoothScrolling() {
  document.addEventListener("click", function (event) {
    const link = event.target.closest('a[href*="#"]');

    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    const isCurrentPage = url.origin === window.location.origin &&
      url.pathname === window.location.pathname &&
      url.search === window.location.search;

    if (!isCurrentPage || !url.hash || url.hash === "#") {
      return;
    }

    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) {
      return;
    }

    event.preventDefault();

    const header = document.querySelector(".site-header");
    const headerOffset = header ? header.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: targetTop,
      behavior: reduceMotion ? "auto" : "smooth"
    });

    window.history.pushState(null, "", url.hash);
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  const isLight = theme === "light";

  root.setAttribute("data-theme", isLight ? "light" : "dark");

  document.querySelectorAll(".theme-toggle").forEach(function (button) {
    button.setAttribute("aria-pressed", isLight ? "true" : "false");
    button.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  });
}

function initThemeToggle() {
  const toggles = document.querySelectorAll(".theme-toggle");
  if (!toggles.length) {
    return;
  }

  let savedTheme = "dark";
  try {
    const stored = localStorage.getItem("epos-theme");
    if (stored === "light" || stored === "dark") {
      savedTheme = stored;
    }
  } catch (error) {
    savedTheme = "dark";
  }

  applyTheme(savedTheme);

  toggles.forEach(function (button) {
    button.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const nextTheme = current === "light" ? "dark" : "light";

      applyTheme(nextTheme);
      try {
        localStorage.setItem("epos-theme", nextTheme);
      } catch (error) {
        // Ignore storage failures (private mode / locked storage).
      }
    });
  });
}

window.addEventListener("load", function () {
  initSmoothScrolling();
  initThemeToggle();

  const gclidField = document.getElementById("gclid");
  const gclidValue = getParameterByName("gclid");

  if (gclidField) {
    gclidField.value = gclidValue || "";
  }

  const form = document.forms["submit-to-google-sheet"];

  document.addEventListener("click", function (event) {
    const trackedLink = event.target.closest('a[href^="tel:"], a[href^="mailto:"]');
    if (trackedLink) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: trackedLink.href.indexOf("tel:") === 0 ? "phone_click" : "email_click",
        link_url: trackedLink.href
      });
    }
  });

  if (!form) {
    return;
  }

  const scriptURL = "https://script.google.com/macros/s/AKfycbze1T0drCrpnI4ascZOAA5mIXtX6wxMF-fufr1IFszMHCK7Fo7LYj4Qk8dB6AwC9Laa/exec";
  const spinner = document.getElementById("spinner");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (spinner) {
      spinner.style.display = "inline-block";
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "generate_lead", form_name: "contact_offer" });

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(function () {
        const appScript = document.querySelector('script[src$="app.js"]');
        const siteRoot = appScript ? new URL(".", appScript.src) : new URL("/", window.location.href);
        window.location.href = new URL("thankyou.html", siteRoot).href;
      })
      .catch(function (error) {
        if (spinner) {
          spinner.style.display = "none";
        }
        console.error("Error submitting form:", error.message);
      });
  });
});
