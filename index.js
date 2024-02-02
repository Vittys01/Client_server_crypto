import dotenv from "dotenv";
import crypto from "crypto";
import {generateKeyPair} from "node-jose/lib/deps/ecc/index.js";

dotenv.config();

const generateKey = async () => {
    return crypto.subtle.generateKey({ name: "AES-CBC", length: 192 }, true, [
        "encrypt",
        "decrypt",
    ]);
};
function hexStringToArrayBuffer(hexString) {
    // remove the leading 0x
    hexString = hexString.replace(/^0x/, "");

    // ensure even number of characters
    if (hexString.length % 2 != 0) {
        console.log(
            "WARNING: expecting an even number of characters in the hexString"
        );
    }

    // create an array buffer from the hex string
    const arrayBuffer = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;

    return arrayBuffer;
}

const importKey = async (keyBuffer) => {
    return crypto.subtle.importKey("raw", keyBuffer, {name: "AES-CBC"}, true, [
        "encrypt",
        "decrypt",
    ]);
};

const encrypt = async (data, key) => {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encryptedBuffer = await crypto.subtle.encrypt(
        {name: "AES-CBC", iv},
        key,
        stringToArrayBuffer(data)
    );

    return {iv, data: new Uint8Array(encryptedBuffer)};
};

const stringToArrayBuffer = (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};
const buf2hex = (buffer) => {
  return [...new Uint8Array(buffer)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
};
const exportKey = async (key) => {
    return crypto.subtle.exportKey("raw", key);
};
(async function () {

    const a = await importKey(stringToArrayBuffer("72f402c3-3a99-432d-9d61-5ba6db8b48e8".replace(/-/g, "")));
    console.log(a )
    /*
    const importedKey = await importKey( stringToArrayBuffer("e8c40a8d-4fba-4afb-bee5-0029141775dc".replace(/-/g, "")));
    let data = {
        "id": "e8c40a8d-4fba-4afb-bee5-0029141775dc",
        "name": "John Doe",
        "age": 25
    };
    const encryptedData = await encrypt(JSON.stringify(data), importedKey);
    console.log("Encrypted data:", buf2hex(encryptedData.data));
    console.log("IV:", buf2hex(encryptedData.iv));
    */
})()
