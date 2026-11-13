/* Novaris Field Kit — Lighting tab: tap-to-explain overhead diagrams. */
import { h, btn, icon, savePdf, slugify, viewFooter, toast } from "../ui.js";
import { getSettings } from "../store.js";
import { lightingSvg, svgToJpeg } from "../diagrams.js";
import { exportDiagram } from "../export.js";

export function render(ctx) {
  const route = `/guide/${ctx.slug}/lighting`;
  const setups = ctx.guide.lighting || [];
  if (ctx.item) {
    const setup = setups.find((s) => s.id === ctx.item);
    if (setup) return detail(ctx, setup, setups, route);
  }

  const root = h("div", { class: "fk-view" },
    h("h2", { class: "fk-view-title" }, "Lighting"),
    h("p", { class: "fk-lede" }, "Overhead diagrams of each setup. Open one and tap any light, modifier, or person to see its role and setup notes."));
  const grid = h("ul", { class: "fk-grid" });
  for (const s of setups) {
    grid.append(h("li", {}, h("a", { class: "fk-tile", href: `#${route}/${s.id}` },
      h("div", { class: "fk-tile-art", html: lightingSvg(s, { interactive: false }) }),
      h("span", { class: "fk-tile-title" }, s.title),
      h("span", { class: "fk-tile-text" }, s.summary))));
  }
  root.append(grid);

  if (ctx.guide.references) {
    const ref = ctx.guide.references;
    const sec = h("section", { class: "fk-section" }, h("h2", { class: "fk-view-title fk-h-small" }, ref.title));
    const list = h("div", { class: "fk-ref-list" });
    for (const r of ref.items) list.append(h("article", { class: "fk-card" }, h("h3", {}, r.title), h("p", {}, r.text)));
    sec.append(list);
    root.append(sec);
  }
  root.append(viewFooter(ctx.guideName, "Lighting"));
  return root;
}

function detail(ctx, setup, setups, route) {
  let selected = null;
  const art = h("div", { class: "fk-diagram" });
  const info = h("div", { class: "fk-info", "aria-live": "polite" });
  const chips = h("div", { class: "fk-chips", role: "group", "aria-label": "Parts of this setup" });

  function draw() {
    art.innerHTML = lightingSvg(setup, { selected });
    art.querySelectorAll(".dg-el").forEach((g) => {
      const choose = () => { selected = selected === g.dataset.id ? null : g.dataset.id; draw(); const again = art.querySelector(`.dg-el[data-id="${CSS.escape(g.dataset.id)}"]`); if (again) again.focus(); };
      g.addEventListener("click", choose);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); } });
    });
    chips.textContent = "";
    for (const el of setup.elements) {
      const b = h("button", { type: "button", class: `fk-chip${selected === el.id ? " is-on" : ""}`, "aria-pressed": String(selected === el.id), onclick: () => { selected = selected === el.id ? null : el.id; draw(); } }, el.label);
      chips.append(b);
    }
    info.textContent = "";
    const el = setup.elements.find((e) => e.id === selected);
    if (el) {
      info.append(h("h3", {}, el.label), h("p", { class: "fk-role" }, el.role), h("p", {}, el.notes));
    } else {
      info.append(h("h3", {}, "Tap a part of the diagram"), h("p", {}, setup.summary), h("p", { class: "fk-muted" }, "Each light, modifier, person, and camera explains its role and how to set it up."));
    }
  }

  const idx = setups.indexOf(setup);
  const prev = setups[idx - 1], next = setups[idx + 1];
  const actions = h("div", { class: "fk-doc-actions" });
  if (!ctx.preview) {
    actions.append(
      btn("Export PDF", "pdf", async () => {
        try {
          const image = await svgToJpeg(lightingSvg(setup, { palette: "print", interactive: false }));
          const bytes = exportDiagram({
            title: setup.title, guideName: ctx.guideName, summary: setup.summary, image, paper: getSettings().paper,
            notes: setup.elements.map((e) => ({ label: e.label, role: e.role, text: e.notes })), tips: setup.tips || []
          });
          savePdf(bytes, `${slugify(setup.title)}.pdf`);
        } catch (err) { toast(err.message, { kind: "error" }); }
      }, "btn btn-small"),
      btn("Print", "print", () => window.print(), "btn btn-small"));
  }

  const root = h("div", { class: "fk-view fk-detail" },
    ctx.preview ? null : h("a", { class: "fk-back", href: `#${route}`, html: icon("back") + "<span>All setups</span>" }),
    h("h2", { class: "fk-view-title" }, setup.title),
    h("p", { class: "fk-lede" }, setup.summary),
    actions,
    h("div", { class: "fk-diagram-layout" }, h("div", {}, art, chips), info),
    setup.tips && setup.tips.length ? h("section", { class: "fk-card" }, h("h3", {}, "Tips"), h("ul", {}, setup.tips.map((t) => h("li", {}, t)))) : null,
    ctx.preview ? null : h("nav", { class: "fk-pager", "aria-label": "Other setups" },
      prev ? h("a", { href: `#${route}/${prev.id}`, class: "btn btn-small", html: icon("back") + `<span>${prev.title}</span>` }) : h("span"),
      next ? h("a", { href: `#${route}/${next.id}`, class: "btn btn-small", html: `<span>${next.title}</span>` + icon("next") }) : h("span")),
    viewFooter(ctx.guideName, `Lighting: ${setup.title}`));
  draw();
  return root;
}
