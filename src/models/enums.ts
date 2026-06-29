/**
 * Enums for the POS+ A2A contract. Values are serialized by their constant
 * name (e.g. `PPPaymentType.POS` -> `"POS"`); POS+ uses snake_case only for
 * field names, not for enum values.
 */

export enum PPTransactionType {
  POST_PAYMENT_START = 'POST_PAYMENT_START',
  POST_PAYMENT_CANCEL = 'POST_PAYMENT_CANCEL',
  POST_EFTPOS = 'POST_EFTPOS',
  POST_EFTPOS_CANCEL = 'POST_EFTPOS_CANCEL',
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  EOD = 'EOD',
  PARAMETERS = 'PARAMETERS',
  ORDER_MULTI_PAYMENT = 'ORDER_MULTI_PAYMENT',
  AVAILABLE_PAYMENT_METHODS = 'AVAILABLE_PAYMENT_METHODS',
}

export enum PPPaymentType {
  POS = 'POS',
  PAYCELL = 'PAYCELL',
  HEPSIPAY = 'HEPSIPAY',
  ISTANBULCARD = 'ISTANBULCARD',
  CASH = 'CASH',
  ONLINE = 'ONLINE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  GASTROPAY = 'GASTROPAY',
  CIO_CARD = 'CIO_CARD',
  IWALLET = 'IWALLET',
  PAYE = 'PAYE',
  MULTINET = 'MULTINET',
  METROPOL = 'METROPOL',
  FASTPAY = 'FASTPAY',
  TICKET = 'TICKET',
  EDENRED = 'EDENRED',
  SETCARD = 'SETCARD',
  SODEXO = 'SODEXO',
  GETIRPAY = 'GETIRPAY',
  TOKENFLEX = 'TOKENFLEX',
  YEMEKMATIK = 'YEMEKMATIK',
  ON_CREDIT = 'ON_CREDIT',
  VIRTUAL_POS = 'VIRTUAL_POS',
  CUZDANPLUS = 'CUZDANPLUS',
}

export enum PPPaymentMethod {
  CC = 'CC',
  CASH = 'CASH',
  QR = 'QR',
  QR_R = 'QR_R',
  NFC = 'NFC',
  QUICKCODE = 'QUICKCODE',
  MOBILE = 'MOBILE',
  SWIPE = 'SWIPE',
  NONE = 'NONE',
  ONLINE = 'ONLINE',
  TRENDYOL = 'TRENDYOL',
  GETIR = 'GETIR',
  YEMEKSEPETI = 'YEMEKSEPETI',
  MIGROSYEMEK = 'MIGROSYEMEK',
}

export enum PPPartialPaymentType {
  AMOUNT = 'AMOUNT',
  PRODUCT = 'PRODUCT',
}

export enum PPEodType {
  POS = 'POS',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE',
  OTHER = 'OTHER',
  MULTINET = 'MULTINET',
  SODEXO = 'SODEXO',
  SETCARD = 'SETCARD',
  TICKET = 'TICKET',
  METROPOL = 'METROPOL',
  PAYE = 'PAYE',
  TOKENFLEX = 'TOKENFLEX',
  EDENRED = 'EDENRED',
  CUZDANPLUS = 'CUZDANPLUS',
  IWALLET = 'IWALLET',
}

export enum PPParameterTypes {
  bank = 'bank',
  multinet = 'multinet',
  metropol = 'metropol',
  paye = 'paye',
  iwallet = 'iwallet',
}

export enum PPCurrencyType {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export enum PPProductTypeEnum {
  PHYSICALLY = 'PHYSICALLY',
  VIRTUAL = 'VIRTUAL',
  INFO = 'INFO',
  MD = 'MD',
  DSN = 'DSN',
  QP = 'QP',
  KFO = 'KFO',
  COMMISSION = 'COMMISSION',
  HGS = 'HGS',
}

export enum PPQtyEnums {
  ADET = 'ADET',
  KG = 'KG',
  GR = 'GR',
  LT = 'LT',
  MT = 'MT',
  KOLI = 'KOLI',
  PAKET = 'PAKET',
  PORSIYON = 'PORSIYON',
}

export enum PPDiscountTypeEnum {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum PPDeliveryTypeEnum {
  CASH_ORDER = 'CASH_ORDER',
  PACKAGE_ORDER = 'PACKAGE_ORDER',
  TABLE_ORDER = 'TABLE_ORDER',
  TAKE_AWAY = 'TAKE_AWAY',
  TAKE_CLOSE = 'TAKE_CLOSE',
}

export enum PPDeliveryStatusEnum {
  WAITING = 'WAITING',
  PREPREING = 'PREPREING',
  READY = 'READY',
  ONWAY = 'ONWAY',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export enum PPOrderStatusEnum {
  CANCEL = 'CANCEL',
  NOT_RESPONSE = 'NOT_RESPONSE',
  WAITING = 'WAITING',
  SUCCESS = 'SUCCESS',
}

export enum PPTransactionStatusEnum {
  SUCCESS = 'SUCCESS',
  CANCEL = 'CANCEL',
  FAIL = 'FAIL',
  NONE = 'NONE',
  WAITING = 'WAITING',
  NOT_RESPONSE = 'NOT_RESPONSE',
}

export enum PPDocumentTypeEnum {
  EFATURA = 'EFATURA',
  EARSIV = 'EARSIV',
  BILGIFISI = 'BILGIFISI',
}

export enum PPDocumentStatusEnum {
  SUCCESS = 'SUCCESS',
  CANCEL = 'CANCEL',
  FAIL = 'FAIL',
  WAITING = 'WAITING',
  NONE = 'NONE',
}

export enum PPOrderSourceEnum {
  POS = 'POS',
  WEB = 'WEB',
  KIOSK = 'KIOSK',
}

export enum PPTransactionTypeEnum {
  START = 'START',
  SATIS = 'SATIS',
  CANCEL = 'CANCEL',
  REFUND = 'REFUND',
}
