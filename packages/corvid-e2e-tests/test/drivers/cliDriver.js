const execa = require("execa");
const which = require("npm-which")(__dirname);
const { parseCommandArgs } = require("./utils");

const CORVID_BIN_PATH = which.sync("corvid");

module.exports = ({ cwd }) => {
  const login = ({ remoteDebuggingPort } = {}) => {
    const query = parseCommandArgs({ remoteDebuggingPort });
    return execa.shell(`${CORVID_BIN_PATH} login ${query}`, { cwd });
  };

  const logout = () => execa.shell(`${CORVID_BIN_PATH} logout`, { cwd });

  const clone = ({
    editorUrl,
    loginRemoteDebuggingPort,
    pullRemoteDebuggingPort
  } = {}) => {
    const query = parseCommandArgs({
      loginRemoteDebuggingPort,
      pullRemoteDebuggingPort
    });
    return execa.shell(`${CORVID_BIN_PATH} clone ${query} "${editorUrl}"`, {
      cwd
    });
  };

  const openEditor = ({ remoteDebuggingPort } = {}) => {
    const query = parseCommandArgs({ remoteDebuggingPort });
    return execa.shell(`${CORVID_BIN_PATH} open-editor ${query}`, { cwd });
  };

  return {
    login,
    logout,
    clone,
    openEditor
  };
};
