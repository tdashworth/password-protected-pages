const site = process.argv.at(2);
const password = process.argv.at(3);

if (!site || !password) {
  console.log(
    `Incorrect format. Please use: 
    npm run hash-password "site-slug" "your secure password your"`
  );
  return;
}

const crypto = require("node:crypto").webcrypto;

hash(`${site}:${password}`).then(console.log);

async function hash(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
