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
  initThemeToggle();

  const gclidField = document.getElementById("gclid");
  const gclidValue = getParameterByName("gclid");

  if (gclidField) {
    gclidField.value = gclidValue || "";
  }

  const form = document.forms["submit-to-google-sheet"];
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

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(function () {
        window.location.href = "thankyou.html";
      })
      .catch(function (error) {
        if (spinner) {
          spinner.style.display = "none";
        }
        console.error("Error submitting form:", error.message);
      });
  });
});
