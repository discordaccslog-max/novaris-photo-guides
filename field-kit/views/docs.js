/*
  Novaris Field Kit — saved documents: shot lists, checklists, worksheets,
  timelines, grouping planners, and questionnaires. Every edit can be undone.
*/
import { h, btn, iconBtn, icon, toast, savePdf, slugify, formatDate, dialog, debounce, viewFooter } from "../ui.js";
import { History, saveDoc, deleteDoc, restoreDoc, docsFor, newId, getSettings } from "../store.js";
import { exportChecklist, exportWorksheet, exportTable, exportGroups, exportQuestionnaire } from "../export.js";

const id = () => newId().slice(-10);

export function createDoc(kind, template, guideSlug, title) {
  let data;
  if (kind === "shotlist" || kind === "checklist") {
    data = { sections: template.sections.map((s) => ({ id: id(), title: s.title, items: s.items.map((i) => ({ id: id(), text: typeof i === "string" ? i : i.text, note: (i && i.note) || "", done: false })) })) };
  } else if (kind === "worksheet") {
    data = { values: {} };
  } else if (kind === "table") {
    data = { rows: template.rows.map((r) => ({ id: id(), done: false, cells: Object.fromEntries(template.columns.map((c, i) => [c.id, r[i] || ""])) })) };
  } else if (kind === "groups") {
    data = { groups: template.groups.map((n) => ({ id: id(), name: n, people: "", done: false })) };
  } else if (kind === "questionnaire") {
    data = { business: "", contact: "", intro: template.intro || "", questions: template.questions.map((t) => ({ id: id(), text: t, answer: "" })) };
  }
  return { id: newId(), guide: guideSlug, templateKind: kind, templateId: template.id, title, data };
}

/* "Saved" list plus a start button for one template. */
export function templateBlock(ctx, kind, template, route) {
  const saved = ctx.preview ? [] : docsFor(ctx.slug, kind).filter((d) => d.templateId === template.id);
  const wrap = h("section", { class: "fk-card fk-template" });
  wrap.append(h("h3", {}, template.title));
  if (template.description) wrap.append(h("p", { class: "fk-muted" }, template.description));
  const start = btn(kind === "shotlist" ? "Start a new session" : "Start new", "plus", async () => {
    const today = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const title = `${template.title} · ${today}`;
    const doc = createDoc(kind, template, ctx.slug, title);
    if (ctx.preview) { ctx.openPreviewDoc(doc); return; }
    saveDoc(doc);
    ctx.navigate(`${route}/${doc.id}`);
  }, "btn btn-primary");
  wrap.append(h("div", { class: "fk-row" }, start));
  if (saved.length) {
    const list = h("ul", { class: "fk-saved", "aria-label": `Saved: ${template.title}` });
    for (const d of saved) {
      const progress = progressOf(d);
      list.append(h("li", {}, h("a", { href: `#${route}/${d.id}`, class: "fk-saved-link" },
        h("span", { class: "fk-saved-title" }, d.title),
        h("span", { class: "fk-saved-meta" }, `${progress ? progress + " · " : ""}Saved ${formatDate(d.updated, true)}`))));
    }
    wrap.append(list);
  }
  return wrap;
}

function progressOf(d) {
  if (d.templateKind === "shotlist" || d.templateKind === "checklist") {
    const items = d.data.sections.flatMap((s) => s.items);
    return `${items.filter((i) => i.done).length}/${items.length} done`;
  }
  if (d.templateKind === "table") return `${d.data.rows.filter((r) => r.done).length}/${d.data.rows.length} done`;
  if (d.templateKind === "groups") return `${d.data.groups.filter((g) => g.done).length}/${d.data.groups.length} groups`;
  return "";
}

/*
  Shared editor frame: title, undo/redo, export, print, delete.
  renderBody(data, api) draws the editing UI; api.commit(data, { render }) saves a change.
*/
export function docEditor(ctx, doc, template, renderBody, { exportOptions = [], backRoute }) {
  let current = doc;
  const history = new History(doc.data);
  const root = h("div", { class: "fk-doc" });
  const body = h("div", { class: "fk-doc-body" });
  const undoB = iconBtn("Undo", "undo", () => undo(), "icon-btn");
  const redoB = iconBtn("Redo", "redo", () => redo(), "icon-btn");
  const status = h("span", { class: "fk-save-status", "aria-live": "polite" }, ctx.preview ? "Preview: changes aren't saved" : "Saved on this device");

  const persist = () => {
    if (!ctx.preview) current = saveDoc(current);
    status.textContent = ctx.preview ? "Preview: changes aren't saved" : "Saved on this device";
  };
  const refreshButtons = () => { undoB.disabled = !history.canUndo; redoB.disabled = !history.canRedo; };
  const api = {
    get data() { return JSON.parse(JSON.stringify(current.data)); },
    commit(data, { render = true } = {}) {
      if (!history.push(data)) return;
      current = { ...current, data };
      persist();
      refreshButtons();
      if (render) draw();
    },
    doc: () => current,
    redraw: () => draw()
  };
  function undo() { if (!history.canUndo) return; current = { ...current, data: history.undo() }; persist(); refreshButtons(); draw(); toast("Undone", { duration: 1500 }); }
  function redo() { if (!history.canRedo) return; current = { ...current, data: history.redo() }; persist(); refreshButtons(); draw(); toast("Redone", { duration: 1500 }); }
  function draw() {
    const focusKey = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.key : null;
    body.textContent = "";
    renderBody(api.data, api, body);
    if (focusKey) { const el = body.querySelector(`[data-key="${CSS.escape(focusKey)}"]`); if (el) el.focus(); }
  }

  const titleInput = h("textarea", { class: "fk-doc-title", rows: "1", "aria-label": "Title", maxlength: "120", spellcheck: "false" });
  titleInput.value = current.title;
  const fitTitle = () => { titleInput.style.height = "auto"; titleInput.style.height = titleInput.scrollHeight + "px"; };
  titleInput.addEventListener("input", fitTitle);
  titleInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); titleInput.blur(); } });
  titleInput.addEventListener("change", () => { current = { ...current, title: titleInput.value.replace(/\s+/g, " ").trim() || current.title }; titleInput.value = current.title; persist(); });
  requestAnimationFrame(fitTitle);

  const actions = h("div", { class: "fk-doc-actions" }, undoB, redoB);
  if (!ctx.preview) {
    for (const opt of exportOptions) {
      actions.append(btn(opt.label, "pdf", () => {
        const bytes = opt.build(current, { paper: getSettings().paper, guideName: ctx.guideName });
        savePdf(bytes, `${slugify(current.title)}${opt.suffix || ""}.pdf`);
      }, "btn btn-small"));
    }
    actions.append(btn("Print", "print", () => window.print(), "btn btn-small"));
    actions.append(iconBtn("Delete", "trash", async () => {
      const ok = await dialog({ title: "Delete this?", body: `“${current.title}” will be removed from this device. You can undo straight after.`, buttons: [{ label: "Cancel", value: false }, { label: "Delete", value: true, danger: true }] });
      if (!ok) return;
      const removed = deleteDoc(current.id);
      ctx.navigate(backRoute);
      toast("Deleted", { action: { label: "Undo", onClick: () => { restoreDoc(removed); ctx.navigate(`${backRoute}/${removed.id}`); } } });
    }, "icon-btn icon-btn-danger"));
  }

  root.append(
    h("a", { class: "fk-back", href: `#${backRoute}`, html: icon("back") + "<span>Back</span>" }),
    h("div", { class: "fk-doc-head" }, titleInput, status),
    actions,
    body
  );
  ctx.setKeyHandler((e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    const mod = e.ctrlKey || e.metaKey;
    if (!mod || typing) return;
    if (e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
    else if ((e.key.toLowerCase() === "z" && e.shiftKey) || e.key.toLowerCase() === "y") { e.preventDefault(); redo(); }
  });
  refreshButtons();
  draw();
  root.append(viewFooter(ctx.guideName, template.title));
  return root;
}

/* ---------- Checklists and shot lists ---------- */

export function checklistEditor(ctx, doc, template, backRoute) {
  let editing = false;
  return docEditor(ctx, doc, template, (data, api, body) => {
    const items = data.sections.flatMap((s) => s.items);
    const done = items.filter((i) => i.done).length;
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;
    const nextItem = items.find((i) => !i.done);

    const bar = h("div", { class: "fk-progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(items.length), "aria-valuenow": String(done), "aria-label": "Progress" },
      h("div", { class: "fk-progress-track" }, h("div", { class: "fk-progress-fill", style: `transform:scaleX(${pct / 100})` })),
      h("p", { class: "fk-progress-label" }, done === items.length && items.length ? h("span", { class: "fk-done-badge", html: icon("check") + " All done" }) : `${done} of ${items.length} done · ${pct}%`));
    const toolbar = h("div", { class: "fk-row fk-row-wrap" },
      btn(editing ? "Finish editing" : "Customize list", editing ? "check" : "edit", () => { editing = !editing; api.redraw(); }, "btn btn-small"),
      btn("Clear all ticks", "reset", () => { const d = api.data; d.sections.forEach((s) => s.items.forEach((i) => (i.done = false))); api.commit(d); }, "btn btn-small"));
    body.append(bar, toolbar);

    function renderSections() {
      data.sections.forEach((section, si) => {
        const secDone = section.items.filter((i) => i.done).length;
        const sec = h("section", { class: "fk-checklist-section" });
        if (editing) {
          const t = h("input", { type: "text", class: "fk-input fk-section-input", value: section.title, "aria-label": "Section name", "data-key": `sec-${section.id}` });
          t.addEventListener("input", debounce(() => { const d = api.data; d.sections[si].title = t.value; api.commit(d, { render: false }); }, 400));
          sec.append(h("div", { class: "fk-section-head" }, t,
            iconBtn("Move section up", "up", () => move(si, -1), "icon-btn", { disabled: si === 0 }),
            iconBtn("Move section down", "down", () => move(si, 1), "icon-btn", { disabled: si === data.sections.length - 1 }),
            iconBtn("Delete section", "trash", () => { const d = api.data; d.sections.splice(si, 1); api.commit(d); }, "icon-btn icon-btn-danger")));
        } else {
          sec.append(h("h3", { class: "fk-section-title" }, section.title, h("span", { class: "fk-section-count" }, `${secDone}/${section.items.length}`)));
        }
        const ul = h("ul", { class: "fk-checklist" });
        section.items.forEach((item, ii) => {
          const li = h("li", { class: `fk-check${item.done ? " is-done" : ""}${!editing && nextItem && nextItem.id === item.id ? " is-next" : ""}` });
          if (editing) {
            const t = h("input", { type: "text", class: "fk-input", value: item.text, "aria-label": "Item text", "data-key": `item-${item.id}` });
            t.addEventListener("input", debounce(() => { const d = api.data; d.sections[si].items[ii].text = t.value; api.commit(d, { render: false }); }, 400));
            li.append(h("div", { class: "fk-edit-row" }, t,
              iconBtn("Move up", "up", () => moveItem(si, ii, -1), "icon-btn", { disabled: ii === 0 }),
              iconBtn("Move down", "down", () => moveItem(si, ii, 1), "icon-btn", { disabled: ii === section.items.length - 1 }),
              iconBtn("Delete item", "trash", () => { const d = api.data; d.sections[si].items.splice(ii, 1); api.commit(d); }, "icon-btn icon-btn-danger")));
          } else {
            const cbId = `cb-${item.id}`;
            const cb = h("input", { type: "checkbox", id: cbId, class: "fk-checkbox", "data-key": `cb-${item.id}` });
            cb.checked = !!item.done;
            cb.addEventListener("change", () => { const d = api.data; d.sections[si].items[ii].done = cb.checked; api.commit(d); });
            const label = h("label", { for: cbId, class: "fk-check-label" },
              h("span", { class: "fk-check-box", html: icon("check") }),
              h("span", { class: "fk-check-text" }, item.text, item.note ? h("span", { class: "fk-check-note" }, item.note) : null),
              !item.done && nextItem && nextItem.id === item.id ? h("span", { class: "fk-next-tag" }, "Next") : null);
            li.append(cb, label);
          }
          ul.append(li);
        });
        sec.append(ul);
        if (editing) {
          const add = h("form", { class: "fk-add-row", onsubmit: (e) => { e.preventDefault(); const v = input.value.trim(); if (!v) return; const d = api.data; d.sections[si].items.push({ id: id(), text: v, note: "", done: false }); api.commit(d); } });
          const input = h("input", { type: "text", class: "fk-input", placeholder: "Add an item to this section", "aria-label": `Add an item to ${section.title}`, "data-key": `add-${section.id}` });
          add.append(input, btn("Add", "plus", null, "btn btn-small", { type: "submit" }));
          sec.append(add);
        }
        body.append(sec);
      });
      if (editing) {
        body.append(btn("Add a section", "plus", () => { const d = api.data; d.sections.push({ id: id(), title: "New section", items: [] }); api.commit(d); }, "btn"));
      }
    }
    function move(si, dir) { const d = api.data; const [s] = d.sections.splice(si, 1); d.sections.splice(si + dir, 0, s); api.commit(d); }
    function moveItem(si, ii, dir) { const d = api.data; const [it] = d.sections[si].items.splice(ii, 1); d.sections[si].items.splice(ii + dir, 0, it); api.commit(d); }
    renderSections();
  }, {
    backRoute,
    exportOptions: [{ label: "Export PDF", build: (d, o) => exportChecklist(d, o) }]
  });
}

/* ---------- Worksheets ---------- */

export function worksheetEditor(ctx, doc, template, backRoute) {
  return docEditor(ctx, doc, template, (data, api, body) => {
    for (const section of template.sections) {
      const fs = h("fieldset", { class: "fk-fieldset" }, h("legend", {}, section.title));
      for (const f of section.fields) {
        const fid = `f-${f.id}`;
        const value = data.values[f.id] || "";
        const input = f.type === "textarea"
          ? h("textarea", { id: fid, class: "fk-input", rows: "3", "data-key": fid })
          : h("input", { id: fid, class: "fk-input", type: f.type || "text", "data-key": fid });
        input.value = value;
        input.addEventListener("input", debounce(() => { const d = api.data; d.values[f.id] = input.value; api.commit(d, { render: false }); }, 450));
        fs.append(h("div", { class: "fk-field" }, h("label", { for: fid }, f.label), input));
      }
      body.append(fs);
    }
  }, {
    backRoute,
    exportOptions: [
      { label: "Export PDF", build: (d, o) => exportWorksheet(d, template, o) },
      { label: "Blank PDF", suffix: "-blank", build: (d, o) => exportWorksheet(d, template, { ...o, blank: true }) }
    ]
  });
}

/* ---------- Timelines and run-of-show tables ---------- */

export function tableEditor(ctx, doc, template, backRoute) {
  return docEditor(ctx, doc, template, (data, api, body) => {
    const done = data.rows.filter((r) => r.done).length;
    body.append(h("p", { class: "fk-progress-label" }, `${done} of ${data.rows.length} done`));
    const list = h("ol", { class: "fk-table-rows" });
    data.rows.forEach((row, ri) => {
      const li = h("li", { class: `fk-table-row${row.done ? " is-done" : ""}` });
      const cbId = `row-${row.id}`;
      const cb = h("input", { type: "checkbox", id: cbId, class: "fk-checkbox", "data-key": cbId });
      cb.checked = !!row.done;
      cb.addEventListener("change", () => { const d = api.data; d.rows[ri].done = cb.checked; api.commit(d); });
      li.append(h("div", { class: "fk-row-check" }, cb, h("label", { for: cbId, class: "fk-check-label fk-check-compact" }, h("span", { class: "fk-check-box", html: icon("check") }), h("span", { class: "visually-hidden" }, `Done: ${row.cells[template.columns[1].id] || "row " + (ri + 1)}`))));
      const cells = h("div", { class: "fk-table-cells" });
      for (const c of template.columns) {
        const cid = `c-${row.id}-${c.id}`;
        const input = h("input", { id: cid, class: `fk-input fk-cell fk-cell-${c.id}`, type: c.id === "time" ? "time" : "text", "data-key": cid });
        input.value = row.cells[c.id] || "";
        input.addEventListener("input", debounce(() => { const d = api.data; d.rows[ri].cells[c.id] = input.value; api.commit(d, { render: false }); }, 450));
        cells.append(h("label", { class: "fk-cell-wrap" }, h("span", { class: "fk-cell-label" }, c.label), input));
      }
      li.append(cells, h("div", { class: "fk-row-tools" },
        iconBtn("Move up", "up", () => moveRow(ri, -1), "icon-btn", { disabled: ri === 0 }),
        iconBtn("Move down", "down", () => moveRow(ri, 1), "icon-btn", { disabled: ri === data.rows.length - 1 }),
        iconBtn("Delete row", "trash", () => { const d = api.data; d.rows.splice(ri, 1); api.commit(d); }, "icon-btn icon-btn-danger")));
      list.append(li);
    });
    body.append(list, btn("Add a row", "plus", () => { const d = api.data; d.rows.push({ id: id(), done: false, cells: Object.fromEntries(template.columns.map((c) => [c.id, ""])) }); api.commit(d); }, "btn"));
    function moveRow(ri, dir) { const d = api.data; const [r] = d.rows.splice(ri, 1); d.rows.splice(ri + dir, 0, r); api.commit(d); }
  }, {
    backRoute,
    exportOptions: [{ label: "Export PDF", build: (d, o) => exportTable(d, template, o) }]
  });
}

/* ---------- Grouping planner ---------- */

export function groupsEditor(ctx, doc, template, backRoute) {
  return docEditor(ctx, doc, template, (data, api, body) => {
    const done = data.groups.filter((g) => g.done).length;
    body.append(h("p", { class: "fk-progress-label" }, `${done} of ${data.groups.length} groups photographed`));
    const list = h("ol", { class: "fk-groups" });
    data.groups.forEach((g, gi) => {
      const li = h("li", { class: `fk-group${g.done ? " is-done" : ""}` });
      const cbId = `g-${g.id}`;
      const cb = h("input", { type: "checkbox", id: cbId, class: "fk-checkbox", "data-key": cbId });
      cb.checked = !!g.done;
      cb.addEventListener("change", () => { const d = api.data; d.groups[gi].done = cb.checked; api.commit(d); });
      const name = h("textarea", { rows: "1", class: "fk-input fk-group-name", "aria-label": `Group ${gi + 1} name`, "data-key": `gn-${g.id}` });
      name.value = g.name;
      const fitName = () => { name.style.height = "auto"; name.style.height = name.scrollHeight + 3 + "px"; };
      name.addEventListener("input", fitName);
      requestAnimationFrame(fitName);
      name.addEventListener("input", debounce(() => { const d = api.data; d.groups[gi].name = name.value; api.commit(d, { render: false }); }, 450));
      const people = h("textarea", { class: "fk-input", rows: "2", placeholder: "Names of everyone in this group", "aria-label": `People in group ${gi + 1}`, "data-key": `gp-${g.id}` });
      people.value = g.people || "";
      people.addEventListener("input", debounce(() => { const d = api.data; d.groups[gi].people = people.value; api.commit(d, { render: false }); }, 450));
      li.append(
        h("div", { class: "fk-group-head" }, cb, h("label", { for: cbId, class: "fk-check-label fk-check-compact" }, h("span", { class: "fk-check-box", html: icon("check") }), h("span", { class: "fk-group-num" }, `Group ${gi + 1}`)), name),
        people,
        h("div", { class: "fk-row-tools" },
          iconBtn("Move up", "up", () => mv(gi, -1), "icon-btn", { disabled: gi === 0 }),
          iconBtn("Move down", "down", () => mv(gi, 1), "icon-btn", { disabled: gi === data.groups.length - 1 }),
          iconBtn("Delete group", "trash", () => { const d = api.data; d.groups.splice(gi, 1); api.commit(d); }, "icon-btn icon-btn-danger")));
      list.append(li);
    });
    body.append(list, btn("Add a group", "plus", () => { const d = api.data; d.groups.push({ id: id(), name: "New group", people: "", done: false }); api.commit(d); }, "btn"));
    function mv(gi, dir) { const d = api.data; const [x] = d.groups.splice(gi, 1); d.groups.splice(gi + dir, 0, x); api.commit(d); }
  }, {
    backRoute,
    exportOptions: [{ label: "Export PDF", build: (d, o) => exportGroups(d, o) }]
  });
}

/* ---------- Client questionnaire ---------- */

export function questionnaireEditor(ctx, doc, template, backRoute) {
  return docEditor(ctx, doc, template, (data, api, body) => {
    const field = (key, label, value, multi, hint) => {
      const fid = `q-${key}`;
      const input = multi ? h("textarea", { id: fid, class: "fk-input", rows: "3", "data-key": fid }) : h("input", { id: fid, class: "fk-input", type: "text", "data-key": fid });
      input.value = value || "";
      input.addEventListener("input", debounce(() => { const d = api.data; d[key] = input.value; api.commit(d, { render: false }); }, 450));
      return h("div", { class: "fk-field" }, h("label", { for: fid }, label), hint ? h("p", { class: "fk-hint" }, hint) : null, input);
    };
    body.append(h("fieldset", { class: "fk-fieldset" }, h("legend", {}, "Your details on the PDF"),
      field("business", "Your business name", data.business, false, "Shown at the top of the questionnaire you send."),
      field("contact", "How clients return it (email or website)", data.contact, false),
      field("intro", "Introduction", data.intro, true)));
    const fs = h("fieldset", { class: "fk-fieldset" }, h("legend", {}, "Questions"),
      h("p", { class: "fk-hint" }, "Edit, reorder, or remove questions. Answers you record here (for example during a call) appear only on the “with answers” PDF."));
    const list = h("ol", { class: "fk-questions" });
    data.questions.forEach((q, qi) => {
      const text = h("textarea", { class: "fk-input", rows: "2", "aria-label": `Question ${qi + 1}`, "data-key": `qt-${q.id}` });
      text.value = q.text;
      text.addEventListener("input", debounce(() => { const d = api.data; d.questions[qi].text = text.value; api.commit(d, { render: false }); }, 450));
      const ans = h("textarea", { class: "fk-input fk-answer", rows: "2", placeholder: "Answer (optional)", "aria-label": `Answer to question ${qi + 1}`, "data-key": `qa-${q.id}` });
      ans.value = q.answer || "";
      ans.addEventListener("input", debounce(() => { const d = api.data; d.questions[qi].answer = ans.value; api.commit(d, { render: false }); }, 450));
      list.append(h("li", { class: "fk-question" }, text, ans, h("div", { class: "fk-row-tools" },
        iconBtn("Move up", "up", () => mv(qi, -1), "icon-btn", { disabled: qi === 0 }),
        iconBtn("Move down", "down", () => mv(qi, 1), "icon-btn", { disabled: qi === data.questions.length - 1 }),
        iconBtn("Delete question", "trash", () => { const d = api.data; d.questions.splice(qi, 1); api.commit(d); }, "icon-btn icon-btn-danger"))));
    });
    fs.append(list, btn("Add a question", "plus", () => { const d = api.data; d.questions.push({ id: id(), text: "New question", answer: "" }); api.commit(d); }, "btn"));
    body.append(fs);
    function mv(qi, dir) { const d = api.data; const [x] = d.questions.splice(qi, 1); d.questions.splice(qi + dir, 0, x); api.commit(d); }
  }, {
    backRoute,
    exportOptions: [
      { label: "PDF for client", suffix: "-for-client", build: (d, o) => exportQuestionnaire(d, { ...o, blank: true }) },
      { label: "PDF with answers", suffix: "-answers", build: (d, o) => exportQuestionnaire(d, { ...o, blank: false }) }
    ]
  });
}

export const EDITORS = {
  shotlist: checklistEditor,
  checklist: checklistEditor,
  worksheet: worksheetEditor,
  table: tableEditor,
  groups: groupsEditor,
  questionnaire: questionnaireEditor
};
