import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { GUIDES, generateRandom, openKitWith, downloadBytes, pdfText } from "./helpers.js";
import { sunTimes, formatTime } from "../../js/sun.js";

test.describe("activation", () => {
  test("start screen, helpful errors, then activation opens the guide", async ({ page }) => {
    await page.goto("/field-kit/");
    await expect(page.locator("h1")).toHaveText("Novaris Field Kit");
    await page.fill("#lic-input", "NOVA-PT-AAAA");
    await page.click(".fk-activate button[type=submit]");
    await expect(page.locator("#lic-error")).toContainText("wrong length");
    const code = generateRandom("PT");
    const typo = code.slice(0, -1) + (code.endsWith("2") ? "3" : "2");
    await page.fill("#lic-input", typo);
    await page.click(".fk-activate button[type=submit]");
    await expect(page.locator("#lic-error")).toContainText("isn't valid");
    await page.fill("#lic-input", code.toLowerCase().replace(/-/g, " "));
    await page.click(".fk-activate button[type=submit]");
    await expect(page).toHaveURL(/#\/guide\/portrait-session-guide/);
    await expect(page.locator(".fk-walkthrough")).toBeVisible();
    await page.locator(".fk-walkthrough button", { hasText: "Next" }).click();
    await page.locator(".fk-walkthrough button", { hasText: "Skip" }).click();
    await expect(page.locator(".fk-walkthrough")).toHaveCount(0);
    await expect(page.locator(".fk-nav .fk-tab")).toHaveCount(5);
  });

  test("a Complete Reference Library code unlocks all five guides", async ({ page }) => {
    await openKitWith(page, [generateRandom("CR")]);
    await expect(page.locator(".fk-guide-card")).toHaveCount(5);
    for (const [slug] of GUIDES) {
      await page.goto(`/field-kit/#/guide/${slug}`);
      await expect(page.locator(".fk-nav")).toBeVisible();
      await expect(page.locator("main")).not.toContainText("isn't active on this device");
    }
  });

  test("a single-guide code unlocks only that guide", async ({ page }) => {
    await openKitWith(page, [generateRandom("WD")]);
    await expect(page.locator(".fk-guide-card")).toHaveCount(1);
    await page.goto("/field-kit/#/guide/event-coverage-guide");
    await expect(page.locator("main h1")).toContainText("isn't active on this device");
  });

  test("licenses are listed in settings, and another can be added", async ({ page }) => {
    const first = generateRandom("FD");
    await openKitWith(page, [first], "#/settings");
    await expect(page.locator(".fk-license")).toHaveCount(1);
    await expect(page.locator(".fk-license .fk-code")).toHaveText(first);
    await page.fill("#lic-input", generateRandom("EV"));
    await page.click(".fk-activate button[type=submit]");
    await expect(page.locator(".fk-license")).toHaveCount(2);
    await expect(page.locator("a[href^='mailto:buckenovaris@novarisguides.com']").first()).toBeVisible();
  });
});

test.describe("guides in use", () => {
  test("shot list: tick, progress, undo and redo, saved after reload", async ({ page }) => {
    await openKitWith(page, [generateRandom("PT")], "#/guide/portrait-session-guide/shotlists");
    await page.locator(".fk-template", { hasText: "Family session" }).getByRole("button", { name: "Start a new session" }).click();
    await expect(page.locator(".fk-progress-label")).toContainText("0 of 13 done");
    const labels = page.locator(".fk-check-label");
    await labels.nth(0).click();
    await labels.nth(1).click();
    await expect(page.locator(".fk-progress-label")).toContainText("2 of 13 done");
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.locator(".fk-progress-label")).toContainText("1 of 13 done");
    await page.getByRole("button", { name: "Redo" }).click();
    await expect(page.locator(".fk-progress-label")).toContainText("2 of 13 done");
    await expect(page.locator(".fk-check.is-next")).toContainText("Full group, everyone looking at camera");
    await page.reload();
    await expect(page.locator(".fk-progress-label")).toContainText("2 of 13 done");
    // Customize: add an item
    await page.getByRole("button", { name: "Customize list" }).click();
    await page.locator(".fk-add-row input").first().fill("Dog with the children");
    await page.locator(".fk-add-row button").first().click();
    await page.getByRole("button", { name: "Finish editing" }).click();
    await expect(page.locator(".fk-progress-label")).toContainText("2 of 14 done");
    const { bytes } = await downloadBytes(page, () => page.getByRole("button", { name: "Export PDF" }).click());
    const pdf = await pdfText(bytes);
    expect(pdf.text).toContain("Family session");
    expect(pdf.text).toContain("Dog with the children");
    expect(pdf.text).toContain("2 of 14 done");
  });

  test("lighting diagram explains each element when tapped", async ({ page }) => {
    await openKitWith(page, [generateRandom("EV")], "#/guide/event-coverage-guide/lighting/ceiling-bounce");
    await expect(page.locator(".fk-info h3")).toHaveText("Tap a part of the diagram");
    await page.locator('.dg-el[data-id="ceiling"]').click();
    await expect(page.locator(".fk-info h3")).toHaveText("Ceiling (bounce surface)");
    await expect(page.locator(".fk-info")).toContainText("large soft light source");
    await page.locator('.dg-el[data-id="flash"]').focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".fk-info h3")).toHaveText("Camera with flash, head up");
  });

  test("worksheet saves on the device and exports filled and blank PDFs", async ({ page }) => {
    await openKitWith(page, [generateRandom("WD")], "#/guide/wedding-day-guide/planning");
    await page.locator(".fk-template", { hasText: "Venue scouting worksheet" }).getByRole("button", { name: "Start new" }).click();
    await page.fill("#f-venue", "Harbour Hall");
    await page.fill("#f-ceiling", "Low, white");
    await page.waitForTimeout(700);
    await page.reload();
    await expect(page.locator("#f-venue")).toHaveValue("Harbour Hall");
    const filled = await downloadBytes(page, () => page.getByRole("button", { name: "Export PDF" }).click());
    const ft = await pdfText(filled.bytes);
    expect(ft.text).toContain("Harbour Hall");
    expect(ft.text).toContain("Low, white");
    const blank = await downloadBytes(page, () => page.getByRole("button", { name: "Blank PDF" }).click());
    const bt = await pdfText(blank.bytes);
    expect(bt.text).toContain("VENUE NAME");
    expect(bt.text).not.toContain("Harbour Hall");
  });

  test("client questionnaire exports a PDF for the client and one with answers", async ({ page }) => {
    await openKitWith(page, [generateRandom("PT")], "#/guide/portrait-session-guide/planning");
    await page.locator(".fk-template", { hasText: "Client questionnaire" }).getByRole("button", { name: "Start new" }).click();
    await page.fill("#q-business", "Lumen Studio");
    await page.locator(".fk-answer").first().fill("Alex and Sam");
    await page.waitForTimeout(700);
    const client = await pdfText((await downloadBytes(page, () => page.getByRole("button", { name: "PDF for client" }).click())).bytes);
    expect(client.text).toContain("LUMEN STUDIO");
    expect(client.text).toContain("Names of everyone being photographed");
    expect(client.text).not.toContain("Alex and Sam");
    const answers = await pdfText((await downloadBytes(page, () => page.getByRole("button", { name: "PDF with answers" }).click())).bytes);
    expect(answers.text).toContain("Alex and Sam");
  });

  test("exposure calculator finds equivalent exposures, including ND filters", async ({ page }) => {
    await openKitWith(page, [generateRandom("FD")], "#/guide/landscape-travel-field-guide/settings");
    await page.selectOption("#calc-ba", { label: "f/8" });
    await page.selectOption("#calc-bs", { label: "1/125" });
    await page.selectOption("#calc-bi", { label: "ISO 100" });
    await page.selectOption("#calc-na", { label: "f/5.6" });
    await page.selectOption("#calc-ni", { label: "ISO 100" });
    await page.selectOption("#calc-nd", { value: "0" });
    await expect(page.locator(".fk-calc-value")).toHaveText("1/250");
    await page.selectOption("#calc-na", { label: "f/8" });
    await page.selectOption("#calc-nd", { value: "10" });
    await expect(page.locator(".fk-calc-value")).toHaveText("8 s");
    await page.locator("label[for=solve-iso]").click();
    await page.selectOption("#calc-nd", { value: "0" });
    await page.selectOption("#calc-ns", { label: "1/500" });
    await expect(page.locator(".fk-calc-value")).toHaveText("ISO 400");
  });

  test("sun planner calculates times for a date and location", async ({ page }) => {
    await openKitWith(page, [generateRandom("FD")], "#/guide/landscape-travel-field-guide/planning/sun");
    await page.fill("#sun-date", "2024-06-21");
    await page.fill("#sun-lat", "51.5074");
    await page.fill("#sun-lon", "-0.1278");
    await page.selectOption("#sun-tz", "Europe/London");
    const expected = sunTimes("2024-06-21", 51.5074, -0.1278, 60);
    await expect(page.locator(".fk-sun-list")).toContainText(`Sunrise${formatTime(expected.sunrise, 60)}`);
    await expect(page.locator(".fk-sun-list")).toContainText(formatTime(expected.sunset, 60));
    await page.getByRole("button", { name: "Save location" }).click();
    const loc = await page.evaluate(() => JSON.parse(localStorage.getItem("nfk.location")));
    expect(loc.lat).toBeCloseTo(51.5074);
    expect(loc.zone).toBe("Europe/London");
  });

  test("display modes and larger interface", async ({ page }) => {
    await openKitWith(page, [generateRandom("PT")], "#/settings");
    await page.locator("label[for=mode-night]").click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "night");
    await page.locator("label[for=mode-outdoor]").click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "outdoor");
    await page.check("#set-large");
    await expect(page.locator("html")).toHaveAttribute("data-size", "large");
    await page.getByRole("button", { name: /Change display mode/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "night");
  });
});

test.describe("backup", () => {
  test("export and import restore licenses and saved work", async ({ page }) => {
    const code = generateRandom("PD");
    await openKitWith(page, [code], "#/guide/product-photography-guide/shotlists");
    await page.locator(".fk-template", { hasText: "Standard e-commerce angles" }).getByRole("button", { name: "Start a new session" }).click();
    await page.locator(".fk-check-label").first().click();
    await page.goto("/field-kit/#/settings");
    const { name, bytes } = await downloadBytes(page, () => page.getByRole("button", { name: "Export backup" }).click());
    expect(name).toMatch(/^novaris-field-kit-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const data = JSON.parse(Buffer.from(bytes).toString("utf8"));
    expect(data.app).toBe("novaris-field-kit");
    expect(data.licenses.map((l) => l.code)).toEqual([code]);
    expect(Object.keys(data.docs)).toHaveLength(1);

    await page.evaluate(() => localStorage.clear());
    await page.goto("/field-kit/#/settings");
    const file = test.info().outputPath("backup.json");
    fs.writeFileSync(file, bytes);
    await page.setInputFiles("#backup-file", file);
    await page.locator(".fk-dialog").getByRole("button", { name: "Import", exact: true }).click();
    await expect(page.locator(".fk-license")).toHaveCount(1);
    const docs = await page.evaluate(() => Object.values(JSON.parse(localStorage.getItem("nfk.docs"))));
    expect(docs[0].data.sections[0].items[0].done).toBe(true);
  });

  test("a reminder appears when no backup has been made in 30 days", async ({ page }) => {
    await openKitWith(page, [generateRandom("PT")], "#/", { walkthroughDone: true, installDismissed: true, firstUse: new Date(Date.now() - 31 * 86400000).toISOString() });
    await page.evaluate(() => localStorage.setItem("nfk.docs", JSON.stringify({ d1: { id: "d1", guide: "portrait-session-guide", templateKind: "worksheet", templateId: "session-plan", title: "Plan", data: { values: {} }, updated: new Date().toISOString() } })));
    await page.reload();
    await expect(page.locator(".fk-banner")).toContainText("Time for a backup");
  });
});

test.describe("offline", () => {
  test("the Field Kit and a guide load with no connection after the first visit", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "Service worker offline test runs in Chromium");
    await openKitWith(page, [generateRandom("CR")], "#/guide/landscape-travel-field-guide/planning/sun");
    await page.waitForFunction(async () => {
      const reg = await navigator.serviceWorker.getRegistration("/field-kit/");
      return !!(reg && reg.active && reg.active.state === "activated");
    }, null, { timeout: 30000 });
    await page.reload();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator(".fk-view-title")).toHaveText("Sunrise and sunset planner");
    await page.goto("/field-kit/#/guide/portrait-session-guide/lighting/window");
    await expect(page.locator(".fk-view-title")).toHaveText("Window light at 45°");
    await context.setOffline(false);
  });
});
