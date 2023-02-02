const project = process.argv.at(2);
const password = process.argv.at(3);

if (!project || !password) {
  console.log(
    `Incorrect format. Please use: 
    npm run hash-password "project-slug" "your secure password your"`
  );
  return;
}

const crypto = require("node:crypto").webcrypto;

hash(`${project}:${password}`).then(console.log);

async function hash(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
