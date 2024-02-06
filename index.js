import crypto from "crypto";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

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
/*
(async function () {
    //PUBLIC
    const importedKey = await importKey( stringToArrayBuffer("e8c40a8d-4fba-4afb-bee5-0029141775dc".replace(/-/g, "")));
    let data = {
        "id": "e8c40a8d-4fba-4afb-bee5-0029141775dc",
        "name": "John Doea",
    };
    const encryptedData = await encrypt(JSON.stringify(data), importedKey);
    console.log("Encrypted data:", buf2hex(encryptedData.data));
    console.log("IV:", buf2hex(encryptedData.iv));

})()
*/
//SERVER A

// Leer la clave pública del Servidor B
const publicKeyB = fs.readFileSync('publicKeyB.pem', 'utf-8');

// Objeto JSON a cifrar
const originalObject = {
    uuid:"e8c40a8d-4fba-4afb-bee5-0029141775dc",
    fuction:"susbtract money",
};

// Cifrado asimétrico usando la clave pública
const encryptedBuffer = crypto.publicEncrypt({
    key: publicKeyB,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
}, Buffer.from(JSON.stringify(originalObject), 'utf-8'));

fs.writeFileSync('encryptedMessageFromA.txt', encryptedBuffer, 'utf-8');
console.log('Objeto cifrado desde Servidor A:\n', encryptedBuffer.toString('base64'));
