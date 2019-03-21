/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const process = require("process");
const { app } = require("electron");
const localFakeEditor = require("@wix/fake-local-mode-editor");
const {
  startInCloneMode,
  startInEditMode
} = require("@wix/wix-code-local-server/src/server");
const { openWindow } = require("../../../src/utils/electron");
const openEditorApp = require("../../../src/apps/open-editor");

const wixCodeConfig = site =>
  JSON.parse(fs.readFileSync(path.join(site, ".wixcoderc.json")));

app.on("ready", () => {
  openWindow({ show: false }).then(async win => {
    const site = path.resolve(path.join(__dirname, process.argv[2]));
    const mode = process.argv[3];

    const localEditorServerPort = await localFakeEditor.start();
    process.env.WIXCODE_CLI_WIX_DOMAIN = `localhost:${localEditorServerPort}`;
    console.log("local editor served on: ", localEditorServerPort);

    try {
      const {
        adminPort: localServerPort,
        close: closeLocalServer
      } = await (mode === "clone"
        ? startInCloneMode(site)
        : startInEditMode(site));

      win.on("page-title-updated", (event, title) => {
        if (title === "Fake local editor") {
          console.log("fake editor loaded");
        }
      });

      setTimeout(() => win.close(), 1000);

      return openEditorApp(
        wixCodeConfig(site),
        localServerPort,
        closeLocalServer,
        {
          useSsl: false
        }
      )(win);
    } catch (exc) {
      console.error(exc);
      process.exit(-1);
    }
  });
});
