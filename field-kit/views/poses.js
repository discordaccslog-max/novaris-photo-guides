/* Novaris Field Kit — Poses tab: illustrated figure references. */
import { h, btn, icon, savePdf, slugify, viewFooter, toast } from "../ui.js";
import { getSettings } from "../store.js";
import { poseSvg, svgToJpeg } from "../diagrams.js";
import { exportDiagram } from "../export.js";

export function render(ctx) {
  const route = `/guide/${ctx.slug}/poses`;
  const poses = ctx.guide.poses || [];
  const pose = ctx.item && poses.find((p) => p.id === ctx.item);
  if (pose) return detail(ctx, pose, poses, route);

  const root = h("div", { class: "fk-view" },
    h("h2", { class: "fk-view-title" }, "Posing references"),
    h("p", { class: "fk-lede" }, "Simple figure diagrams with notes on each pose. The amber figure is the main subject; the camera marker shows a suggested lens height."));
  const grid = h("ul", { class: "fk-grid" });
  for (const p of poses) {
    grid.append(h("li", {}, h("a", { class: "fk-tile", href: `#${route}/${p.id}` },
      h("div", { class: "fk-tile-art", html: poseSvg(p) }),
      h("span", { class: "fk-tile-title" }, p.title),
      h("span", { class: "fk-tile-text" }, p.notes[0]))));
  }
  root.append(grid, viewFooter(ctx.guideName, "Poses"));
  return root;
}

function detail(ctx, pose, poses, route) {
  const idx = poses.indexOf(pose);
  const prev = poses[idx - 1], next = poses[idx + 1];
  const actions = h("div", { class: "fk-doc-actions" });
  if (!ctx.preview) {
    actions.append(
      btn("Export PDF", "pdf", async () => {
        try {
          const image = await svgToJpeg(poseSvg(pose, { palette: "print" }));
          const bytes = exportDiagram({ title: pose.title, guideName: ctx.guideName, image, paper: getSettings().paper, notes: [], tips: pose.notes });
          savePdf(bytes, `pose-${slugify(pose.title)}.pdf`);
        } catch (err) { toast(err.message, { kind: "error" }); }
      }, "btn btn-small"),
      btn("Print", "print", () => window.print(), "btn btn-small"));
  }
  const camera = { eye: "Eye level", chest: "Chest height", waist: "Waist height" }[pose.camera] || "";
  return h("div", { class: "fk-view fk-detail" },
    ctx.preview ? null : h("a", { class: "fk-back", href: `#${route}`, html: icon("back") + "<span>All poses</span>" }),
    h("h2", { class: "fk-view-title" }, pose.title),
    actions,
    h("div", { class: "fk-diagram-layout" },
      h("div", { class: "fk-diagram", html: poseSvg(pose) }),
      h("div", { class: "fk-info" },
        h("h3", {}, "Notes"),
        h("ul", { class: "fk-notes" }, pose.notes.map((n) => h("li", {}, n))),
        camera ? h("p", { class: "fk-muted" }, `Suggested camera height: ${camera}.`) : null)),
    ctx.preview ? null : h("nav", { class: "fk-pager", "aria-label": "Other poses" },
      prev ? h("a", { href: `#${route}/${prev.id}`, class: "btn btn-small", html: icon("back") + `<span>${prev.title}</span>` }) : h("span"),
      next ? h("a", { href: `#${route}/${next.id}`, class: "btn btn-small", html: `<span>${next.title}</span>` + icon("next") }) : h("span")),
    viewFooter(ctx.guideName, `Poses: ${pose.title}`));
}
