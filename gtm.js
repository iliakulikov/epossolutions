(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var first = d.getElementsByTagName(s)[0];
  var tag = d.createElement(s);
  var layer = l !== "dataLayer" ? "&l=" + l : "";
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtm.js?id=" + i + layer;
  first.parentNode.insertBefore(tag, first);
})(window, document, "script", "dataLayer", "GTM-NH4PNFD");
