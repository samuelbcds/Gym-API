import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import configDotenv from "./dotenv";


configDotenv();

(() => {
  try {
    const passphrase = process.env.RSA_PASSPHRASE;
    if (!passphrase) {
      console.error("Erro: A variável RSA_PASSPHRASE deve estar definida no arquivo .env");
      process.exit(1);
    }

    const keyPair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: passphrase
      },
    });

    const keysDir = path.join(__dirname, "..", "..", "keys");
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir, { recursive: true });
      console.log("Diretório 'keys' criado");
    }

    const publicKeyPath = path.join(keysDir, "id_rsa_pub.pem");
    const privateKeyPath = path.join(keysDir, "id_rsa_priv.pem");

    fs.writeFileSync(publicKeyPath, keyPair.publicKey);
    fs.writeFileSync(privateKeyPath, keyPair.privateKey);

    if (process.platform !== 'win32') {
      fs.chmodSync(privateKeyPath, 0o600);
    }

    console.log("Chaves geradas com sucesso!");

  } catch (error) {
    console.error("Erro ao gerar as chaves:", error);
    process.exit(1);
  }
})();