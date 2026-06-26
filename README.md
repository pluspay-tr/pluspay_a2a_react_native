# pluspay-a2a-react-native

**POS+ (Pluspay)** Android uygulaması ile App-to-App (A2A) iletişim kurmak için geliştirilmiş React Native paketi. Bu paket, React Native uygulamanızdan POS+ uygulamasını başlatarak ödeme, iptal, EFT işlemleri, sipariş ödemeleri, gün sonu raporları ve parametre güncellemeleri yapmanızı sağlar.

> **Not:** Bu paket yalnızca Android platformunu desteklemektedir. iOS'ta tüm çağrılar `UNSUPPORTED_PLATFORM` ile reddedilir.

## Kurulum

Paketi npm üzerinden ekleyin:

```sh
yarn add pluspay-a2a-react-native
# veya npm:
npm install pluspay-a2a-react-native
```

RN ≥ 0.60 **autolinking** native modülü otomatik bağlar; ek kurulum gerekmez. Android 11+ paket görünürlüğü için gerekli `<queries>` girdisi paket manifestinde tanımlıdır ve host uygulamaya merge olur.

## Hızlı Başlangıç

```ts
import {
  PPA2AClient,
  PPA2AException,
  PPPaymentType,
  PPPaymentMethod,
  PPStartPaymentRequestModel,
} from 'pluspay-a2a-react-native';

// 1. İstemciyi oluşturun ve başlatın
const pluspay = new PPA2AClient();
await pluspay.initialize();

// 2. Ödeme başlatın
try {
  const result = await pluspay.startPayment(
    PPStartPaymentRequestModel.toRequest({
      orderCode: 'ORD-001',
      totalAmount: 150.0,
      paymentType: PPPaymentType.POS,
      paymentMethod: PPPaymentMethod.CC,
    })
  );
  console.log('Ödeme başarılı:', result.status);
} catch (e) {
  if (e instanceof PPA2AException) {
    console.log('Ödeme başarısız:', e.errorCode, e.message);
  }
}

// 3. İşiniz bittiğinde kaynakları temizleyin
await pluspay.dispose();
```

## İstemci Metodları

Tüm metodlar `PPA2AClient` sınıfı üzerindedir. Her metod başarılı durumda bir yanıt nesnesi (POS+'tan gelen snake_case JSON) döner, hata durumunda `PPA2AException` fırlatır.

| Metod | İstek Builder'ı | Açıklama |
|-------|-----------------|----------|
| `startPayment` | `PPStartPaymentRequestModel.toRequest` | Ödeme başlat |
| `cancelPayment` | `PPCancelPaymentRequestModel.toRequest` | Ödeme iptal et |
| `startEftPayment` | `PPEftPaymentRequestModel.toRequest` | EFT POS ödemesi başlat |
| `cancelEftPayment` | `PPEftCancelRequestModel.toRequest` | EFT POS ödemesini iptal et |
| `startOrderPayment` | `PPOrderPaymentRequestModel.toRequest` | Sipariş ödemesi başlat |
| `startMultiPayment` | `PPMultiPaymentRequest.toRequest` | Çoklu ödeme başlat |
| `triggerEod` | `PPEodRequestModel.toRequest` | Gün sonu tetikle |
| `triggerParameters` | `PPParameterRequestModel.toRequest` | Parametre güncellemesi tetikle |

## İstek Modelleri

Her istek builder'ı, düz ve kullanışlı bir API sunan **`toRequest`** fonksiyonuna sahiptir. İlgili alanları doğrudan geçirirsiniz; builder dahili `header` + `data` yapısını sizin için oluşturur.

### Ödeme Başlat

```ts
PPStartPaymentRequestModel.toRequest({
  orderCode: 'ORD-001',
  totalAmount: 100.0,
  paymentType: PPPaymentType.POS,
  paymentMethod: PPPaymentMethod.CC,
  installment: 3,            // opsiyonel
  isPartial: false,          // opsiyonel, varsayılan: false
  partialType: undefined,    // opsiyonel
  products: [],              // opsiyonel
  billingInformation: undefined, // opsiyonel
});
```

### Ödeme İptal

```ts
PPCancelPaymentRequestModel.toRequest({
  orderCode: 'ORD-001',
  transactionId: 'TX-123',
  note: 'Müşteri iptali talep etti', // opsiyonel
});
```

### EFT Ödeme

```ts
PPEftPaymentRequestModel.toRequest({
  totalAmount: 250.0,
  paymentType: PPPaymentType.POS,
  paymentMethod: PPPaymentMethod.CC,
  transactionId: 'EFT-001',
  taxRate: 18,
  installment: undefined, // opsiyonel
});
```

### EFT İptal

```ts
PPEftCancelRequestModel.toRequest({
  transactionId: 'EFT-001',
  totalAmount: 250.0,
});
```

### Sipariş Ödemesi

```ts
PPOrderPaymentRequestModel.toRequest({
  orderCode: 'ORD-001',
});
```

### Gün Sonu (EOD)

```ts
PPEodRequestModel.toRequest({
  isAll: false,
  types: [PPEodType.POS, PPEodType.MULTINET],
});
```

### Parametre Yükleme

```ts
PPParameterRequestModel.toRequest({
  isAll: true,
  types: [PPParameterTypes.bank, PPParameterTypes.multinet],
});
```

### Çoklu Ödeme (Multi Payment)

```ts
PPMultiPaymentRequest.toRequest({
  orderCode: 'ORD-001',
  orderDate: new Date(),
  changePaymentStatus: true,
  products: [
    {
      id: 1,
      sku: 'SKU-001',
      title: 'Ürün 1',
      price: 100.0,
      quantity: 1,
      taxRate: 10,
      unit: PPQtyEnums.ADET,
      vatInclude: true,
      productType: PPProductTypeEnum.PHYSICALLY,
      discountValue: 0,
      otvOrani: 0,             // opsiyonel, varsayılan: 0
      konaklamaOrani: 0,       // opsiyonel, varsayılan: 0
    },
  ],
  transactions: [
    {
      paymentType: PPPaymentType.POS,
      totalAmount: 100.0,
      paymentMethod: PPPaymentMethod.CC,
    },
  ],
  currency: PPCurrencyType.TRY,                // opsiyonel, varsayılan: TRY
  deliveryType: PPDeliveryTypeEnum.CASH_ORDER, // opsiyonel, varsayılan: CASH_ORDER
  discountAmount: 0,                           // opsiyonel, varsayılan: 0
  billingInformation: undefined,               // opsiyonel
  installment: undefined,                      // opsiyonel
  groupCode: undefined,                        // opsiyonel
  note: undefined,                             // opsiyonel
  canTryAgain: true,                           // opsiyonel, varsayılan: true
});
```

## Yanıt Modelleri

POS+ yanıtları snake_case JSON olarak döner ve istemci bunları olduğu gibi (hafif tipli nesneler olarak) döndürür. Sık kullanılan alanlar tiplenmiştir; ek alanlara da indeks imzası ile erişilebilir.

```ts
const res = await pluspay.startPayment(/* ... */);
res.status;        // string
res.order_code;    // string
res.total_amount;  // number
res.total_paid;    // number
```

| Metod | Önemli alanlar |
|-------|----------------|
| `startPayment` / `cancelPayment` / EFT | `status`, `order_code`, `total_amount`, `total_paid`, `amount_due`, `is_partial`, `card_number_masked`, `rrn` |
| `startOrderPayment` | `status`, `completed`, `order_code`, `grand_total`, `total_paid`, `amount_due`, `results` |
| `startMultiPayment` | `order_code`, `status`, `grand_total`, `total_paid`, `products`, `transactions` |
| `triggerEod` | `success`, `results`, `error_message` |
| `triggerParameters` | `completed`, `results`, `error_message` |

## Enum'lar

### PPPaymentType

`POS`, `PAYCELL`, `HEPSIPAY`, `ISTANBULCARD`, `CASH`, `ONLINE`, `BANK_TRANSFER`, `GASTROPAY`, `CIO_CARD`, `IWALLET`, `PAYE`, `MULTINET`, `METROPOL`, `FASTPAY`, `TICKET`, `EDENRED`, `SETCARD`, `SODEXO`, `GETIRPAY`, `TOKENFLEX`, `YEMEKMATIK`, `ON_CREDIT`, `VIRTUAL_POS`, `CUZDANPLUS`

### PPPaymentMethod

`CC`, `CASH`, `QR`, `QR_R`, `NFC`, `QUICKCODE`, `MOBILE`, `SWIPE`, `NONE`, `ONLINE`, `TRENDYOL`, `GETIR`, `YEMEKSEPETI`, `MIGROSYEMEK`

### PPEodType

`POS`, `CASH`, `BANK_TRANSFER`, `ONLINE`, `OTHER`, `MULTINET`, `SODEXO`, `SETCARD`, `TICKET`, `METROPOL`, `PAYE`, `TOKENFLEX`, `EDENRED`, `CUZDANPLUS`, `IWALLET`

### PPParameterTypes

`bank`, `multinet`, `metropol`, `paye`, `iwallet`

### PPPartialPaymentType

`AMOUNT`, `PRODUCT`

### PPOrderStatusEnum

`CANCEL`, `NOT_RESPONSE`, `WAITING`, `SUCCESS`

### PPDeliveryStatusEnum

`WAITING`, `PREPREING`, `READY`, `ONWAY`, `COMPLETE`, `CANCEL`

### PPDeliveryTypeEnum

`CASH_ORDER`, `PACKAGE_ORDER`, `TABLE_ORDER`, `TAKE_AWAY`, `TAKE_CLOSE`

### PPCurrencyType

`TRY`, `USD`, `EUR`, `GBP`

### PPProductTypeEnum

`PHYSICALLY`, `VIRTUAL`, `INFO`, `MD`, `DSN`, `QP`, `KFO`, `COMMISSION`, `HGS`

### PPQtyEnums

`ADET`, `KG`, `GR`, `LT`, `MT`, `KOLI`, `PAKET`, `PORSIYON`

### PPDiscountTypeEnum

`PERCENTAGE`, `FIXED_AMOUNT`

### PPDocumentTypeEnum

`EFATURA`, `EARSIV`, `BILGIFISI`

### PPDocumentStatusEnum

`SUCCESS`, `CANCEL`, `FAIL`, `WAITING`, `NONE`

### PPTransactionStatusEnum

`SUCCESS`, `CANCEL`, `FAIL`, `NONE`, `WAITING`, `NOT_RESPONSE`

### PPTransactionTypeEnum

`START`, `SATIS`, `CANCEL`, `REFUND`

### PPOrderSourceEnum

`POS`, `WEB`, `KIOSK`

## Hata Yönetimi

POS+ bir hata yanıtı döndürdüğünde (örn. yetersiz bakiye, kullanıcı iptali), istemci `PPA2AException` fırlatır:

```ts
try {
  const result = await pluspay.startPayment(request);
} catch (e) {
  if (e instanceof PPA2AException) {
    console.log(e.errorCode); // örn. "PP-A2A-006"
    console.log(e.message);   // örn. "İşlem kullanıcı veya sistem tarafından iptal edildi!"
  }
}
```

İstemci tarafındaki hatalar için de aynı exception fırlatılır:

| Hata Kodu | Açıklama |
|-----------|----------|
| `NOT_INITIALIZED` | `initialize()` çağrılmadan istek gönderildi |
| `LAUNCH_INTENT_ERROR` | POS+ uygulaması başlatılamadı |
| `PP-A2A-PARSE` | Yanıt JSON'ı ayrıştırılamadı |
| `PP-A2A-*` | POS+ tarafından döndürülen hata kodları |

## Yaşam Döngüsü

```ts
function PaymentScreen() {
  const clientRef = useRef<PPA2AClient | null>(null);

  useEffect(() => {
    const client = new PPA2AClient();
    clientRef.current = client;
    client.initialize();
    return () => {
      client.dispose();
    };
  }, []);

  // ...
}
```

`initialize()` diğer tüm metodlardan önce çağrılmalıdır. Uygulamanın paket bilgilerini alır ve POS+ sonuçları için bir broadcast receiver kaydeder. İstemciye artık ihtiyaç kalmadığında receiver'ı temizlemek için `dispose()` çağrılmalıdır.

## Örnek Uygulama

```sh
corepack enable
yarn install
# Android cihaz/emülatör bağlı ve POS+ kurulu olmalı
yarn example android
```

## Geliştirme

```sh
yarn typecheck   # tip kontrolü
yarn test        # serializasyon/sözleşme birim testleri
yarn prepare     # paketi lib/ altına derle (bob)
```

## Gereksinimler

- Yalnızca Android
- Cihazda POS+ uygulaması yüklü olmalıdır
- Minimum SDK: 24

## Lisans

MIT
