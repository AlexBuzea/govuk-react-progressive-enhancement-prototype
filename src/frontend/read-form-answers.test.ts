import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { readFormAnswers } from "./read-form-answers";

/**
 * readFormAnswers runs in the browser, so these tests build small forms in a
 * fake browser window (jsdom) and read them, the way an island does just before
 * hydrating. Each test sets up the form the way the server would have sent it,
 * then changes it the way a user would before React starts.
 */
function readForm(formHtml: string, userChanges: (form: HTMLFormElement) => void = () => {}) {
  const dom = new JSDOM(`<div id="island"><form>${formHtml}</form></div>`);

  // The helper uses the global FormData, which has to be the fake window's one
  // to understand a form from that window
  globalThis.FormData = dom.window.FormData as unknown as typeof FormData;

  userChanges(dom.window.document.querySelector("form")!);
  return readFormAnswers(dom.window.document.getElementById("island")!);
}

describe("readFormAnswers", () => {
  it("reads text inputs, textareas and single selects as strings", () => {
    const answers = readForm(
      `<input name="fullName" value="Sam Smith">
       <textarea name="notes">Back gate code 1234</textarea>
       <select name="duration"><option value="1">1</option><option value="6" selected>6</option></select>`
    );
    assert.deepEqual(answers, { fullName: "Sam Smith", notes: "Back gate code 1234", duration: "6" });
  });

  it("reads what the user typed, not the value the server sent", () => {
    const answers = readForm(`<input name="fullName" value="">`, (form) => {
      form.querySelector("input")!.value = "Typed early";
    });
    assert.equal(answers.fullName, "Typed early");
  });

  it("reads the selected radio, and leaves out a group with nothing selected", () => {
    const radios = `<input type="radio" name="duration" value="1"><input type="radio" name="duration" value="6">`;
    assert.deepEqual(readForm(radios), {});
    assert.deepEqual(
      readForm(radios, (form) => form.querySelectorAll("input")[1].click()),
      { duration: "6" }
    );
  });

  it("reads ticked checkboxes as a list, with every ticked value", () => {
    const answers = readForm(
      `<input type="checkbox" name="extras" value="bay">
       <input type="checkbox" name="extras" value="permit">
       <input type="checkbox" name="extras" value="mirror">`,
      (form) => {
        const boxes = form.querySelectorAll("input");
        boxes[0].click();
        boxes[2].click();
      }
    );
    assert.deepEqual(answers, { extras: ["bay", "mirror"] });
  });

  it("gives an empty list when no checkbox is ticked", () => {
    const answers = readForm(`<input type="checkbox" name="extras" value="bay">`);
    assert.deepEqual(answers, { extras: [] });
  });

  it("notices a box the server sent ticked and the user then unticked", () => {
    // A browser leaves unticked boxes out of a form, so without the empty list
    // this box would look untouched and React would tick it again
    const answers = readForm(`<input type="checkbox" name="agree" value="yes" checked>`, (form) => {
      form.querySelector("input")!.click();
    });
    assert.deepEqual(answers, { agree: [] });
  });

  it("reads every selected option of a multi-select", () => {
    const answers = readForm(
      `<select name="zones" multiple>
         <option value="A1" selected>A1</option><option value="B1">B1</option><option value="C1" selected>C1</option>
       </select>`
    );
    assert.deepEqual(answers, { zones: ["A1", "C1"] });
  });

  it("gives an empty list for a multi-select with nothing selected", () => {
    const answers = readForm(`<select name="zones" multiple><option value="A1">A1</option></select>`);
    assert.deepEqual(answers, { zones: [] });
  });

  it("leaves out disabled fields, which the user cannot change", () => {
    const answers = readForm(
      `<input name="reference" value="REF-1" disabled>
       <input type="checkbox" name="locked" value="yes" checked disabled>
       <select name="locked-zones" multiple disabled><option value="A1" selected>A1</option></select>`
    );
    assert.deepEqual(answers, {});
  });

  it("leaves out file inputs", () => {
    const answers = readForm(`<input type="file" name="evidence">`);
    assert.deepEqual(answers, {});
  });

  it("returns nothing when the island has no form", () => {
    const dom = new JSDOM(`<div id="island"><p>No form here</p></div>`);
    assert.deepEqual(readFormAnswers(dom.window.document.getElementById("island")!), {});
  });
});
