const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Uygulamanın verilerini saklayacağı dizini bulma
function getAppDataPath() {
  if (os.platform() === 'win32') {
    return path.join(process.env.APPDATA, 'seyfooksck');  // Windows
  } else if (os.platform() === 'linux' || os.platform() === 'darwin') {
    return path.join(os.homedir(), '.seyfooksck');  // Linux / macOS
  } else {
    throw new Error('Unsupported platform');
  }
}

// Anahtar oluşturma (prefix ile key oluşturulacak)
function generateKey({ prefix = '', secret, appname = '', keysize = 32 }) {
  if (!secret) {
    throw new Error('Secret is required to generate the key');
  }

  const baseString = secret + appname; // Anahtarın temel stringi (prefix hariç)
  const hash = crypto.createHash('sha256');
  hash.update(baseString);
  const rawKey = hash.digest('hex');  // 64 karakterlik bir hash oluşturulacak (SHA-256)

  // Anahtar uzunluğunu keysize ile sınırlayalım
  const truncatedKey = rawKey.slice(0, keysize);

  // Prefix'i başa ekleyelim
  const finalKey = prefix ? `${prefix}-${truncatedKey}` : truncatedKey;

  return finalKey;
}

// Anahtarı dosyadan okuma veya oluşturma
function readKey({ prefix = '', secret, appname = '', keysize = 32 }) {
  if (!secret) {
    throw new Error('Secret is required to generate the key');
  }

  const appDataPath = getAppDataPath();
  const keyFilePath = path.join(appDataPath, 'skeyid.json');

  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });  // Eğer dizin yoksa oluştur
  }

  if (!fs.existsSync(keyFilePath)) {
    // Anahtar dosyası yoksa, yeni bir anahtar oluştur
    const key = generateKey({ prefix, secret, appname, keysize });
    const encodedKey = JSON.stringify({
      key,
      prefix,   // Şifreli anahtarın şifre çözme işlemi için parametreleri de sakla
      secret,
      appname,
    });
    fs.writeFileSync(keyFilePath, encodedKey);
    return key;
  }

  // Anahtar dosyasını oku
  const data = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
  return data.key;
}

// Anahtarı sıfırlama (yeni bir anahtar oluşturma)
function resetKey({ prefix = '', secret, appname = '', keysize = 32 }) {
  if (!secret) {
    throw new Error('Secret is required to reset the key');
  }

  const appDataPath = getAppDataPath();
  const keyFilePath = path.join(appDataPath, 'skeyid.json');

  const newKey = generateKey({ prefix, secret, appname, keysize });
  const encodedKey = JSON.stringify({
    key: newKey,
    prefix,
    secret,
    appname,
  });
  fs.writeFileSync(keyFilePath, encodedKey);
  return newKey;
}

// `skeyid` fonksiyonu bir nesne içinde tanımlı olacak şekilde güncelleniyor
function skeyid({ prefix = '', secret, appname = '', keysize = 32, command = '' }) {
  if (!secret) {
    throw new Error('Secret is required to generate the key');
  }

  if (command === 'reset') {
    return resetKey({ prefix, secret, appname, keysize });
  } else {
    return readKey({ prefix, secret, appname, keysize });
  }
}

// Dekoder: Şifreli anahtarı çözüp, parametreleri gösterir
function decodeKeyInfo() {
  const appDataPath = getAppDataPath();
  const keyFilePath = path.join(appDataPath, 'skeyid.json');

  if (fs.existsSync(keyFilePath)) {
    const data = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    return {
      prefix: data.prefix,
      secret: data.secret,
      appname: data.appname
    };
  }

  return null;
}

// Modül dışa aktarılıyor
module.exports = { skeyid, decodeKeyInfo };
