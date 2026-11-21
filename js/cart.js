/*
  Novaris Photo Guides — shopping cart (vanilla JavaScript, no dependencies).

  The cart lives in this browser's localStorage under "novaris-cart" as
  [{ id: "<product id>", addons: ["<option id>", ...] }, ...]. Each product
  appears once (guides are digital, so there are no quantities).

  window.NOVARIS_CART.items() returns the cart joined with js/products.js:
  [{ id, product, addons: [{ id, name, price }], total }]. The checkout form
  (checkout.html, a placeholder for now) should read the order from there.
*/
(function () {
  "use strict";

  var KEY = "novaris-cart";
  var products = Array.isArray(window.NOVARIS_PRODUCTS) ? window.NOVARIS_PRODUCTS : [];
  var memory = [];
  var listeners = [];

  function findProduct(id) {
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return null;
  }

  function formatPrice(value) {
    var n = Number(value);
    return "$" + (n % 1 === 0 ? n.toFixed(0) : n.toFixed(2));
  }

  /* Read the stored cart, dropping anything that no longer matches the catalog. */
  function read() {
    var raw = memory;
    try {
      var stored = JSON.parse(window.localStorage.getItem(KEY) || "[]");
      if (Array.isArray(stored)) raw = stored;
    } catch (e) { /* storage unavailable: keep the in-memory cart */ }
    var seen = {};
    return raw.filter(function (line) {
      if (!line || typeof line.id !== "string" || seen[line.id] || !findProduct(line.id)) return false;
      seen[line.id] = true;
      return true;
    }).map(function (line) {
      var options = findProduct(line.id).options || [];
      var addons = Array.isArray(line.addons) ? line.addons : [];
      return { id: line.id, addons: options.filter(function (o) { return addons.indexOf(o.id) !== -1; }).map(function (o) { return o.id; }) };
    });
  }

  function write(lines) {
    memory = lines;
    try { window.localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) { /* in-memory only */ }
    listeners.forEach(function (fn) { fn(); });
  }

  var cart = {
    lines: read,
    items: function () {
      return read().map(function (line) {
        var product = findProduct(line.id);
        var addons = (product.options || []).filter(function (o) { return line.addons.indexOf(o.id) !== -1; });
        var total = addons.reduce(function (sum, o) { return sum + Number(o.price); }, Number(product.price));
        return { id: line.id, product: product, addons: addons, total: total };
      });
    },
    get: function (id) {
      var lines = read();
      for (var i = 0; i < lines.length; i++) if (lines[i].id === id) return lines[i];
      return null;
    },
    /* Add a product, or replace its add-ons if it's already in the cart. */
    set: function (id, addons) {
      if (!findProduct(id)) return;
      var lines = read().filter(function (l) { return l.id !== id; });
      lines.push({ id: id, addons: Array.isArray(addons) ? addons.slice() : [] });
      write(lines);
    },
    remove: function (id) { write(read().filter(function (l) { return l.id !== id; })); },
    clear: function () { write([]); },
    count: function () { return read().length; },
    subtotal: function () { return cart.items().reduce(function (sum, item) { return sum + item.total; }, 0); },
    onChange: function (fn) { listeners.push(fn); },
    formatPrice: formatPrice
  };
  window.NOVARIS_CART = cart;

  /* Keep other open tabs in step. */
  window.addEventListener("storage", function (event) {
    if (event.key === KEY) listeners.forEach(function (fn) { fn(); });
  });

  /* ---------- Header cart count ---------- */

  function renderCount() {
    var n = cart.count();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
    document.querySelectorAll(".header-cart").forEach(function (link) {
      link.setAttribute("aria-label", n === 0 ? "Cart, empty" : "Cart, " + n + (n === 1 ? " item" : " items"));
    });
  }
  cart.onChange(renderCount);
  renderCount();

  /* ---------- Shared pieces for the cart and checkout pages ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function kindLine(product) {
    return product.format === "pdf"
      ? "Printable PDF guide · " + product.pages + " pages"
      : "Field Kit guide · unlocks with a license code";
  }

  function emptyState(root) {
    var box = el("div", "cart-empty");
    box.appendChild(el("p", null, "Your cart is empty."));
    var link = el("a", "btn btn-primary", "Browse the guides");
    link.href = "/index.html#guides";
    box.appendChild(link);
    root.appendChild(box);
  }

  function itemRow(item, editable) {
    var li = el("li", "cart-item");
    li.setAttribute("data-cart-item", item.id);
    var main = el("div", "cart-item-main");
    var name = el("h2", "cart-item-name");
    var link = el("a", null, item.product.name);
    link.href = "/" + item.product.slug + ".html";
    name.appendChild(link);
    main.appendChild(name);
    main.appendChild(el("p", "cart-item-kind", kindLine(item.product)));
    var rows = el("ul", "cart-lines");
    var base = el("li");
    base.appendChild(el("span", null, "Guide"));
    base.appendChild(el("span", null, formatPrice(item.product.price)));
    rows.appendChild(base);
    item.addons.forEach(function (o) {
      var row = el("li");
      row.appendChild(el("span", null, "+ " + o.name));
      row.appendChild(el("span", null, formatPrice(o.price)));
      rows.appendChild(row);
    });
    main.appendChild(rows);
    if (editable) {
      var actions = el("div", "cart-item-actions");
      if ((item.product.options || []).length) {
        var edit = el("a", null, item.addons.length ? "Change add-ons" : "Choose add-ons");
        edit.href = "/" + item.product.slug + ".html#add-ons";
        actions.appendChild(edit);
      }
      var remove = el("button", "link-button", "Remove");
      remove.type = "button";
      remove.setAttribute("aria-label", "Remove " + item.product.name + " from your cart");
      remove.addEventListener("click", function () { cart.remove(item.id); });
      actions.appendChild(remove);
      main.appendChild(actions);
    }
    li.appendChild(main);
    li.appendChild(el("p", "cart-item-total", formatPrice(item.total)));
    return li;
  }

  function totals(root) {
    var box = el("div", "cart-totals");
    var sub = el("p", "cart-subtotal");
    sub.appendChild(el("span", null, "Subtotal"));
    var amount = el("strong", null, formatPrice(cart.subtotal()));
    amount.setAttribute("data-cart-subtotal", "");
    sub.appendChild(amount);
    box.appendChild(sub);
    box.appendChild(el("p", "cart-note", "Prices in USD. Applicable taxes are shown at checkout."));
    root.appendChild(box);
    return box;
  }

  /* ---------- Cart page ---------- */

  var cartRoot = document.querySelector("[data-cart-page]");
  var agreed = false;
  function renderCart() {
    cartRoot.textContent = "";
    var items = cart.items();
    if (!items.length) return emptyState(cartRoot);
    var list = el("ul", "cart-list");
    items.forEach(function (item) { list.appendChild(itemRow(item, true)); });
    cartRoot.appendChild(list);
    var box = totals(cartRoot);

    var label = el("label", "buy-check");
    label.setAttribute("for", "cart-agree");
    var check = el("input");
    check.type = "checkbox";
    check.id = "cart-agree";
    check.checked = agreed;
    check.setAttribute("aria-describedby", "cart-agree-hint");
    label.appendChild(check);
    var text = el("span");
    text.innerHTML = 'I agree to the <a href="/terms.html">Terms of Service</a> and <a href="/refunds.html">Refund Policy</a>';
    label.appendChild(text);
    box.appendChild(label);

    var go = el("a", "btn btn-primary cart-checkout", "Continue to checkout");
    go.setAttribute("role", "link");
    go.tabIndex = 0;
    var hint = el("p", "buy-hint", "Tick the box to agree to the Terms of Service and Refund Policy before continuing to checkout.");
    hint.id = "cart-agree-hint";
    function sync() {
      agreed = check.checked;
      if (agreed) {
        go.href = "/checkout.html";
        go.removeAttribute("aria-disabled");
        go.classList.remove("is-disabled");
      } else {
        go.removeAttribute("href");
        go.setAttribute("aria-disabled", "true");
        go.classList.add("is-disabled");
      }
      hint.hidden = agreed;
    }
    go.addEventListener("click", function (event) {
      if (!check.checked) { event.preventDefault(); check.focus(); }
    });
    check.addEventListener("change", sync);
    sync();
    box.appendChild(go);
    box.appendChild(hint);
  }
  if (cartRoot) {
    cart.onChange(renderCart);
    renderCart();
  }

  /* ---------- Checkout page (placeholder): order summary only ---------- */

  var summaryRoot = document.querySelector("[data-checkout-summary]");
  function renderSummary() {
    summaryRoot.textContent = "";
    var items = cart.items();
    document.querySelectorAll("[data-checkout-ready]").forEach(function (node) { node.hidden = !items.length; });
    if (!items.length) return emptyState(summaryRoot);
    var list = el("ul", "cart-list cart-list-compact");
    items.forEach(function (item) { list.appendChild(itemRow(item, false)); });
    summaryRoot.appendChild(list);
    totals(summaryRoot);
  }
  if (summaryRoot) {
    cart.onChange(renderSummary);
    renderSummary();
  }
})();
