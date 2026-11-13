/* Novaris Field Kit — Shot Lists tab. */
import { h, viewFooter } from "../ui.js";
import { getDoc } from "../store.js";
import { templateBlock, checklistEditor, createDoc } from "./docs.js";

export function render(ctx) {
  const route = `/guide/${ctx.slug}/shotlists`;
  const templates = ctx.guide.shotlists || [];

  if (ctx.preview && ctx.item) {
    const t = templates.find((x) => x.id === ctx.item) || templates[0];
    return checklistEditor(ctx, createDoc("shotlist", t, ctx.slug, t.title), t, route);
  }
  if (ctx.item) {
    const doc = getDoc(ctx.item);
    const template = doc && templates.find((t) => t.id === doc.templateId);
    if (!doc || !template) return notFound(route);
    return checklistEditor(ctx, doc, template, route);
  }

  const root = h("div", { class: "fk-view" },
    h("h2", { class: "fk-view-title" }, "Shot lists"),
    h("p", { class: "fk-lede" }, "Each list is in shooting order. Start a session from a template, tick shots off as you go, and customize it for the client. Sessions are saved on this device."));
  for (const t of templates) root.append(templateBlock(ctx, "shotlist", t, route));
  root.append(viewFooter(ctx.guideName, "Shot lists"));
  return root;
}

export function notFound(route) {
  return h("div", { class: "fk-view" },
    h("h2", { class: "fk-view-title" }, "Not found on this device"),
    h("p", {}, "This saved item isn't in this browser. It may have been deleted, or saved on another device. Use Export backup and Import backup in Settings to move saved work between devices."),
    h("p", {}, h("a", { href: `#${route}`, class: "btn" }, "Back to the list")));
}
