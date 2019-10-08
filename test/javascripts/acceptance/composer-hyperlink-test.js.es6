import { acceptance } from "helpers/qunit-helpers";

acceptance("Composer - Hyperlink", {
  loggedIn: true
});

QUnit.test("add a hyperlink to a reply", async assert => {
  await visit("/t/internationalization-localization/280");
  await click(".topic-post:first-child button.reply");
  await fillIn(".d-editor-input", "This is a link to ");

  assert.equal(
    find(".insert-link.modal-body").length,
    0,
    "no hyperlink modal by default"
  );

  await click(".d-editor button.link");
  assert.equal(
    find(".insert-link.modal-body").length,
    1,
    "hyperlink modal visible"
  );

  await fillIn(".modal-body .link-url", "google.com");
  await fillIn(".modal-body .link-text", "Google");
  await click(".modal-footer button.btn-primary");

  assert.equal(
    find(".d-editor-input").val(),
    "This is a link to [Google](http://google.com)",
    "adds link with url and text, prepends 'http://'"
  );

  assert.equal(
    find(".insert-link.modal-body").length,
    0,
    "modal dismissed after submitting link"
  );

  await fillIn(".d-editor-input", "Reset textarea contents.");

  await click(".d-editor button.link");
  await fillIn(".modal-body .link-url", "google.com");
  await fillIn(".modal-body .link-text", "Google");
  await click(".modal-footer button.btn-danger");

  assert.equal(
    find(".d-editor-input").val(),
    "Reset textarea contents.",
    "adds link with url and text, prepends 'http://'"
  );

  assert.equal(
    find(".insert-link.modal-body").length,
    0,
    "modal dismissed after cancelling"
  );

  const textarea = find("#reply-control .d-editor-input")[0];
  textarea.selectionStart = 0;
  textarea.selectionEnd = 6;
  await click(".d-editor button.link");

  await fillIn(".modal-body .link-url", "somelink.com");
  await click(".modal-footer button.btn-primary");

  assert.equal(
    find(".d-editor-input").val(),
    "[Reset](http://somelink.com) textarea contents.",
    "adds link to a selected text"
  );
});