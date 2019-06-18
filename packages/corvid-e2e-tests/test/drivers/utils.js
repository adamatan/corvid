const wixEventually = require("wix-eventually");
const getPort = require("get-port");

const camelCaseToDashSeparated = string =>
  string.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);

const byAid = aid => `[data-aid="${aid}"]`;

const eventually = wixEventually.with({ timeout: 40000 });

const parseCommandArgs = args =>
  Object.entries(args)
    .map(arg =>
      arg[1] ? `--${camelCaseToDashSeparated(arg[0])}=${arg[1]}` : ""
    )
    .join(" ");

module.exports = {
  byAid,
  eventually,
  parseCommandArgs,
  findFreePort: getPort
};
