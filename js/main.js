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

  /* Also drives the reading progress bar and the back-to-top button. */

  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress");
  var toTop = document.querySelector(".to-top");
  if (header) {
    var ticking = false;
    var update = function () {
      var y = window.scrollY;
      header.classList.toggle("is-compact", y > 24);
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
      }
      if (toTop) {
        var show = y > 900;
        toTop.classList.toggle("is-visible", show);
        toTop.setAttribute("aria-hidden", show ? "false" : "true");
        toTop.tabIndex = show ? 0 : -1;
      }
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
    if (id === "top") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      var brand = document.querySelector(".brand");
      if (brand) brand.focus({ preventScroll: true });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
      return;
    }
    var target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (history.pushState) history.pushState(null, "", "#" + id);
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });

  /* ---------- "Inside a guide" tabbed viewer ---------- */

  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var tablist = root.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    if (!tablist || !tabs.length) return;
    tablist.hidden = false;

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      panels.forEach(function (panel, i) {
        var on = i === index;
        panel.setAttribute("data-state", on ? "in" : "out");
        panel.style.zIndex = on ? "2" : "1";
        panel.inert = !on;
        if (on) panel.removeAttribute("aria-hidden");
        else panel.setAttribute("aria-hidden", "true");
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, false); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== null) {
          event.preventDefault();
          select(next, true);
        }
      });
    });
    select(0, false);
  });

  /* ---------- Card spotlight follows the pointer ---------- */

  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (event.clientX - rect.left) + "px");
        card.style.setProperty("--my", (event.clientY - rect.top) + "px");
      });
    });
  }

  /* ---------- Preview lightbox ---------- */

  var pages = document.querySelectorAll(".preview-page");
  if (pages.length && typeof HTMLDialogElement === "function") {
    var dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", "Enlarged page preview");
    dialog.innerHTML =
      '<div class="lightbox-inner">' +
      '<button class="lightbox-close" type="button" aria-label="Close preview">&times;</button>' +
      '<div class="lightbox-page"></div>' +
      '<p class="lightbox-cap"></p>' +
      "</div>";
    document.body.appendChild(dialog);
    var slot = dialog.querySelector(".lightbox-page");
    var caption = dialog.querySelector(".lightbox-cap");
    var opener = null;

    dialog.querySelector(".lightbox-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      if (opener) opener.focus();
    });

    pages.forEach(function (page) {
      var svg = page.querySelector("svg");
      if (!svg) return;
      var titleEl = svg.querySelector("title");
      var title = titleEl ? titleEl.textContent : "Page preview";
      var button = document.createElement("button");
      button.type = "button";
      button.className = "preview-open";
      button.setAttribute("aria-label", "Enlarge preview: " + title);
      button.innerHTML = '<span aria-hidden="true">Enlarge &#8599;</span>';
      page.appendChild(button);
      button.addEventListener("click", function () {
        var clone = svg.cloneNode(true);
        clone.querySelectorAll("[id]").forEach(function (n) { n.removeAttribute("id"); });
        clone.removeAttribute("aria-labelledby");
        clone.setAttribute("aria-label", title);
        slot.textContent = "";
        slot.appendChild(clone);
        caption.textContent = title;
        opener = button;
        dialog.showModal();
      });
    });
  }

  /* ---------- Policy pages: contents list ---------- */

  var toc = document.querySelector("[data-toc]");
  if (toc) {
    var wide = window.matchMedia("(min-width: 1001px)");
    var syncOpen = function () { if (wide.matches) toc.open = true; };
    syncOpen();
    if (wide.addEventListener) wide.addEventListener("change", syncOpen);

    var links = {};
    toc.querySelectorAll("a[href^='#']").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var headings = Object.keys(links).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if ("IntersectionObserver" in window && headings.length) {
      var setActive = function (id) {
        Object.keys(links).forEach(function (key) { links[key].classList.toggle("is-active", key === id); });
      };
      var tocObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      headings.forEach(function (h) { tocObserver.observe(h); });
    }
  }

})();
