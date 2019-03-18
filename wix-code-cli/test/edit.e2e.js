const { runFixture } = require("./utils");

describe("edit", () => {
  test("should connect to a local server", () => {
    expect.assertions(1);

    return expect(runFixture("edit")).resolves.toMatchObject([
      0,
      expect.arrayContaining(["local server connection established\n"]),
      expect.anything()
    ]);
  });

  test("should open the app with the correct editor URL", () => {
    expect.assertions(1);

    return expect(runFixture("edit")).resolves.toMatchObject([
      0,
      expect.arrayContaining(["fake editor loaded\n"]),
      expect.anything()
    ]);
  });

  test("should open the editor with the local server port", () => {
    expect.assertions(1);

    return expect(runFixture("edit")).resolves.toMatchObject([
      0,
      expect.arrayContaining(["editor connected\n"]),
      expect.anything()
    ]);
  });

  test("should exit with status code 255 when the local server is not in edit mode", () => {
    expect.assertions(1);

    return expect(runFixture("edit", ["clone"])).resolves.toMatchObject([
      255,
      expect.anything(),
      expect.arrayContaining(["local server is not in edit mode\n"])
    ]);
  });

  test("should update local files with changes", () => {
    // expect(true).toBe(false)
  });

  test("should watch local site files", () => {
    // expect(true).toBe(false)
  });
});
