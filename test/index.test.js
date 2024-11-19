const { skeyid, decodeKeyInfo } = require('./skeyidModule');

// Parametreleri bir nesne olarak doğru şekilde geçirelim
const skeydata = {
  prefix: 'pub',           // Prefix başa eklenir
  secret: 'mySecret',      // Zorunlu
  appname: 'myApp',        // İsteğe bağlı
  keysize: 64              // Zorunlu
};

// Nesne parametrelerini kullanarak skeyid fonksiyonunu çağırıyoruz
const key1 = skeyid(skeydata); // Burada nesne parametreleri doğru şekilde geçilmelidir

console.log('Generated Key 1:', key1); // Örnek çıktı: pub-b6a95611d2be2287fc25de45979d674c28f3836078b4d8d3c575c6c0beffbe17

// Anahtarı sıfırlamak için `reset` komutu ile çağırıyoruz
const newKey = skeyid({ ...skeydata, command: 'reset' });
console.log('Reset Key:', newKey);

// Anahtarın şifre çözülmesi
const decoded = decodeKeyInfo();  // Yeni oluşturulan anahtarın içeriği
console.log('Decoded Key Info:', decoded);
