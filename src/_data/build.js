const crypto = require("crypto");
const fs = require("fs");

module.exports = function () {
  try {
    const css = fs.readFileSync("./src/assets/css/output.css");
    return { cssHash: crypto.createHash("md5").update(css).digest("hex").slice(0, 8) };
  } catch {
    return { cssHash: "dev" };
  }
};
