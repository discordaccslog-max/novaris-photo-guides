/* Novaris Photo Guides — site behaviour (vanilla JavaScript, no dependencies). */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Products: prices and buy buttons from js/products.js ---------- */

  var products = Array.isArray(window.NOVARIS_PRODUCTS) ? window.NOVARIS_PRODUCTS : [];

  function findProduct(id) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) return products[i];
    }
    return null;
  }

  function formatPrice(value) {
    var n = Number(value);
    return "$" + (n % 1 === 0 ? n.toFixed(0) : n.toFixed(2));
  }

  function validCheckoutUrl(url) {
    if (typeof url !== "string") return "";
    var trimmed = url.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : "";
  }

  document.querySelectorAll("[data-product]").forEach(function (scope) {
    var product = findProduct(scope.getAttribute("data-product"));
    if (!product) return;

    scope.querySelectorAll("[data-price]").forEach(function (el) {
      el.textContent = formatPrice(product.price);
    });
    scope.querySelectorAll("[data-name]").forEach(function (el) {
      el.textContent = product.name;
    });

    var url = validCheckoutUrl(product.checkoutUrl);
    scope.querySelectorAll("[data-buy]").forEach(function (slot) {
      slot.textContent = "";
      if (!url) return;
      var link = document.createElement("a");
      link.className = "btn btn-primary";
      link.href = url;
      link.rel = "noopener";
      link.textContent = "Buy " + product.name + " — " + formatPrice(product.price);
      slot.appendChild(link);
    });
  });

  /* ---------- Current year in the footer ---------- */

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Sticky header compacts on scroll ---------- */

  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var update = function () {
      header.classList.toggle("is-compact", window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* ---------- Scroll-triggered reveals ---------- */

  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Smooth scroll for same-page anchors ---------- */

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (history.pushState) history.pushState(null, "", "#" + id);
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });

})();
