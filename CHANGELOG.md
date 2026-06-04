# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-04

### Added

- **İlk sürüm**: PlusPay POS+ App2App (A2A) entegrasyonu için React Native paketi (yalnızca Android).
- **`PPA2AClient`**: `startPayment`, `cancelPayment`, `startEftPayment`, `cancelEftPayment`, `startOrderPayment`, `startMultiPayment`, `triggerEod`, `triggerParameters` metodları.
- **İnce native köprü** (Kotlin TurboModule): A2A intent'i (`com.pluspay.POS_A2A`) gönderir, sonucu `BroadcastReceiver` ile alır ve Promise olarak döndürür.
- **TypeScript modeller ve `toRequest` builder'ları**: POS+ sözleşmesiyle birebir aynı snake_case JSON çıktısı (`tax_office`, `total_amount`, `otv_orani`, `konaklama_orani`, `can_try_again`, `customer`, billing `code`, …).
- **Enum'lar**: POS+ tarafıyla uyumlu 18 enum (`PPPaymentType`, `PPPaymentMethod`, `PPEodType`, `PPParameterTypes`, `PPCurrencyType`, `PPProductTypeEnum`, `PPQtyEnums`, `PPDiscountTypeEnum`, `PPDeliveryTypeEnum`, `PPDeliveryStatusEnum`, `PPTransactionType`, `PPTransactionTypeEnum`, …).
- **`PPA2AException`**: POS+ hata yanıtları (`error_code`/`error_message`) ve intent başlatma hataları için.
- **Android 11+ paket görünürlüğü**: `<queries>` girdisi paket manifestinde tanımlı.
- **Örnek uygulama**: Tüm metodlar için test butonları.
- **Birim testleri**: Serializasyon/sözleşme parite testleri (Jest).

### Notes

- POS+ A2A Android intent tabanlı olduğundan paket yalnızca Android'de çalışır. iOS'ta tüm çağrılar `UNSUPPORTED_PLATFORM` ile reddedilir.
- Çoklu ödemede `serial_no` gönderilmez (POS+ cihazın kendi seri numarasını kullanır).
- İstek gövdesinde set edilmemiş opsiyonel alanlar JSON'a eklenmez (native Kotlin paketiyle aynı davranış; POS+ ikisini de tolere eder).
