

# s-key-id (Secure Key Generator)

`s-key-id` modülü, kullanıcıların güvenli anahtarlar oluşturabilmesi için geliştirilmiş bir Node.js modülüdür. Modül, kullanıcıların belirlediği bir `prefix`, `secret`, `appname` ve `keysize` parametrelerine dayalı benzersiz anahtarlar üretir. Ayrıca, anahtarları dosyaya kaydedebilir, sıfırlayabilir ve mevcut anahtarı çözebilir.

## Özellikler
- **Prefix**: Anahtarın başına eklenebilecek isteğe bağlı bir ön ek.
- **Secret**: Anahtarın oluşturulmasında kullanılan zorunlu bir parametre.
- **Appname**: Anahtarı özelleştirmek için isteğe bağlı bir parametre.
- **Keysize**: Anahtarın uzunluğunu belirler, varsayılan olarak 32 karakterdir.
- **Anahtar Sıfırlama**: Eski anahtarları sıfırlayarak yenisini oluşturma imkanı.
- **Anahtar Çözme (Decode)**: Anahtarın içindeki prefix, secret ve appname bilgilerini çözebilme.

## Kurulum

### 1. Node.js Modülü Olarak Kullanım

Modülü kullanmak için öncelikle Node.js projenize dahil etmeniz gerekiyor. Aşağıdaki komutla modülü kurabilirsiniz:

```bash
npm install s-key-id
```

### 2. Projenize Dahil Etme

Modülü projenize dahil etmek için şu şekilde kullanabilirsiniz:

```javascript
const { skeyid, decodeKeyInfo } = require('s-key-id');
```

## Kullanım

### 1. Anahtar Oluşturma

Anahtar oluşturmak için, `skeyid()` fonksiyonuna bir nesne ile parametrelerinizi geçmeniz yeterlidir. Anahtarın başına bir `prefix` ekleyebilir, `secret` ve `keysize` değerlerini belirleyebilirsiniz.

#### Örnek 1: Anahtar Oluşturma

```javascript
const { skeyid } = require('s-key-id');

const skeydata = {
  prefix: 'pub',           // Prefix başa eklenir (isteğe bağlı)
  secret: 'mySecret',      // Zorunlu secret
  appname: 'myApp',        // İsteğe bağlı
  keysize: 64              // Zorunlu keysize (anahtar uzunluğu)
};

const key = skeyid(skeydata);

console.log('Generated Key:', key);  // Örnek çıktı: pub-b6a95611d2be2287fc25de45979d674c28f3836078b4d8d3c575c6c0beffbe17
```

### 2. Anahtar Sıfırlama

Eğer mevcut anahtarınızı sıfırlamak istiyorsanız, `command: 'reset'` parametresi ile `skeyid()` fonksiyonunu çağırabilirsiniz.

#### Örnek 2: Anahtar Sıfırlama

```javascript
const { skeyid } = require('s-key-id');

const skeydata = {
  prefix: 'pub',           // Prefix başa eklenir
  secret: 'mySecret',      // Zorunlu secret
  appname: 'myApp',        // İsteğe bağlı
  keysize: 64              // Zorunlu keysize
};

// Anahtarı sıfırlıyoruz
const newKey = skeyid({ ...skeydata, command: 'reset' });

console.log('Reset Key:', newKey);  // Örnek çıktı: pub-b6a95611d2be2287fc25de45979d674c28f3836078b4d8d3c575c6c0beffbe17
```

### 3. Anahtarın İçeriğini Görüntüleme (Decode)

Oluşturduğunuz anahtarın içeriğini çözmek için `decodeKeyInfo()` fonksiyonunu kullanabilirsiniz. Bu fonksiyon, anahtarın içinde yer alan `prefix`, `secret` ve `appname` bilgilerini döndürür.

#### Örnek 3: Anahtarın İçeriğini Çözme

```javascript
const { decodeKeyInfo } = require('s-key-id');

// Anahtarın içeriğini çözüp ekrana yazdıralım
const decoded = decodeKeyInfo();
console.log('Decoded Key Info:', decoded);
// Örnek çıktı: { prefix: 'pub', secret: 'mySecret', appname: 'myApp' }
```

## Parametreler

- **prefix**: (İsteğe bağlı) Anahtarın başında yer alacak olan ek, örneğin `'pub'`, `'dev'` vb. Varsayılan: `''` (boş).
- **secret**: (Zorunlu) Anahtarın içerik kısmını oluşturmak için kullanılan gizli değer.
- **appname**: (İsteğe bağlı) Uygulamanızın adı. Varsayılan: `''` (boş).
- **keysize**: (Zorunlu) Anahtarın uzunluğu. Varsayılan: `32` (32 karakter).
- **command**: (Opsiyonel) `reset` komutu ile mevcut anahtar sıfırlanabilir.

## Çalışma Prensibi

Anahtarlar, verilen `prefix`, `secret` ve `appname` bilgilerinin birleştirilmesiyle oluşturulur. Bu bilgiler birleştirilerek SHA-256 algoritması ile hashlenir. Sonuç olarak, belirttiğiniz uzunlukta (keysize) kesilmiş benzersiz bir anahtar oluşturulur.

Örnek bir anahtar formatı şu şekilde olacaktır:

```
<Prefix>-<GeneratedKey>
```

Örneğin, `'pub'` prefix'i ve `'mySecret'` secret'ı ile 64 karakter uzunluğunda oluşturulan bir anahtar şöyle görünebilir:

```
pub-b6a95611d2be2287fc25de45979d674c28f3836078b4d8d3c575c6c0beffbe17
```



## Sıkça Sorulan Sorular (FAQ)

### 1. **Anahtar neden sıfırlanabilir?**
Anahtarlarınız güvenlik gereksinimleri nedeniyle değiştirilebilir. Anahtar sıfırlama işlemi, eski anahtarınızı geçersiz kılar ve yeni bir anahtar üretir.

### 2. **Anahtarın uzunluğunu nasıl belirleyebilirim?**
`keysize` parametresi ile anahtarın uzunluğunu belirleyebilirsiniz. Bu, SHA-256 algoritması ile elde edilen hash uzunluğunun kısıtlanmasını sağlar.

### 3. **Prefix ne işe yarar?**
`prefix`, anahtarın başında yer alacak isteğe bağlı bir ek'dir. Anahtarın başına belirlediğiniz herhangi bir değer eklenebilir. Bu, farklı projeler veya uygulamalar için anahtarları ayırmanıza olanak tanır.

## Katkıda Bulunma

Herhangi bir hata veya katkı yapmak isterseniz, lütfen bir pull request gönderin veya issue açın.

## Geliştiriciler

- [Seyfooksck](https://github.com/Seyfooksck)
- [GitHub](https://github.com/Seyfooksck/s-key-id)

info@seyfooksck.com 
---
