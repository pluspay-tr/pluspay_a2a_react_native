import {
  PPCurrencyType,
  PPDeliveryStatusEnum,
  PPDeliveryTypeEnum,
  PPDiscountTypeEnum,
  PPEodType,
  PPParameterTypes,
  PPPartialPaymentType,
  PPPaymentMethod,
  PPPaymentType,
  PPProductTypeEnum,
  PPQtyEnums,
  PPTransactionType,
} from './enums';

/** Raw A2A request envelope sent to POS+ (`{ data?, header }`). */
export interface PPRequest {
  data?: Record<string, any>;
  header: Record<string, any>;
}

/** Formats a Date as `yyyy-MM-dd HH:mm` (the format POS+ expects). */
export function formatOrderDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function header(
  transactionType: PPTransactionType,
  extra?: { orderCode?: string; transactionId?: string }
): Record<string, any> {
  return {
    transaction_type: transactionType,
    order_code: extra?.orderCode,
    transaction_id: extra?.transactionId,
  };
}

// ---------------------------------------------------------------------------
// Billing & product sub-models
// ---------------------------------------------------------------------------

export interface PPBillingInfo {
  name: string;
  identity: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  taxOffice?: string;
  code?: string;
}

function billingToJson(b?: PPBillingInfo): Record<string, any> | undefined {
  if (!b) return undefined;
  return {
    name: b.name,
    identity: b.identity,
    phone: b.phone,
    email: b.email,
    address: b.address,
    city: b.city,
    district: b.district,
    tax_office: b.taxOffice,
    code: b.code,
  };
}

/** Simple product reference used by `startPayment`. */
export interface PPProduct {
  id: string;
  qty?: number;
}

/** Full product line used by `startMultiPayment`. */
export interface ProductModel {
  id: number;
  sku: string;
  unit: PPQtyEnums;
  price: number;
  title: string;
  quantity: number;
  taxRate: number;
  vatInclude: boolean;
  productType: PPProductTypeEnum;
  discountValue: number;
  description?: string;
  categoryCode?: string;
  categoryName?: string;
  discountType?: PPDiscountTypeEnum;
  exemptionCode?: string;
  /** ÖTV oranı. Default 0. */
  otvOrani?: number;
  /** Konaklama oranı. Default 0. */
  konaklamaOrani?: number;
}

function productToJson(p: ProductModel): Record<string, any> {
  return {
    id: p.id,
    sku: p.sku,
    unit: p.unit,
    price: p.price,
    title: p.title,
    quantity: p.quantity,
    tax_rate: p.taxRate,
    description: p.description,
    vat_include: p.vatInclude,
    product_type: p.productType,
    discount_value: p.discountValue,
    category_code: p.categoryCode,
    category_name: p.categoryName,
    discount_type: p.discountType,
    exemption_code: p.exemptionCode,
    otv_orani: p.otvOrani ?? 0,
    konaklama_orani: p.konaklamaOrani ?? 0,
  };
}

export interface TransactionModel {
  paymentType: PPPaymentType;
  totalAmount: number;
  paymentMethod?: PPPaymentMethod;
}

function transactionToJson(t: TransactionModel): Record<string, any> {
  return {
    payment_type: t.paymentType,
    total_amount: t.totalAmount,
    payment_method: t.paymentMethod,
  };
}

// ---------------------------------------------------------------------------
// Request builders (`*.toRequest`)
// ---------------------------------------------------------------------------

export const PPStartPaymentRequestModel = {
  toRequest(params: {
    orderCode: string;
    paymentType: PPPaymentType;
    paymentMethod: PPPaymentMethod;
    totalAmount: number;
    installment?: number;
    isPartial?: boolean;
    partialType?: PPPartialPaymentType;
    products?: PPProduct[];
    billingInformation?: PPBillingInfo;
  }): PPRequest {
    return {
      data: {
        payment_type: params.paymentType,
        payment_method: params.paymentMethod,
        total_amount: params.totalAmount,
        installment: params.installment,
        is_partial: params.isPartial ?? false,
        partial_type: params.partialType,
        products: (params.products ?? []).map((p) => ({
          id: p.id,
          qty: p.qty ?? 1,
        })),
        billing_information: billingToJson(params.billingInformation),
      },
      header: header(PPTransactionType.POST_PAYMENT_START, {
        orderCode: params.orderCode,
      }),
    };
  },
};

export const PPCancelPaymentRequestModel = {
  toRequest(params: {
    orderCode: string;
    transactionId: string;
    note?: string;
  }): PPRequest {
    return {
      data: { transaction_id: params.transactionId, note: params.note },
      header: header(PPTransactionType.POST_PAYMENT_CANCEL, {
        orderCode: params.orderCode,
      }),
    };
  },
};

export const PPEftPaymentRequestModel = {
  toRequest(params: {
    totalAmount: number;
    paymentType: PPPaymentType;
    paymentMethod: PPPaymentMethod;
    transactionId: string;
    taxRate: number;
    installment?: number;
  }): PPRequest {
    return {
      data: {
        total_amount: params.totalAmount,
        payment_type: params.paymentType,
        payment_method: params.paymentMethod,
        transaction_id: params.transactionId,
        tax_rate: params.taxRate,
        installment: params.installment,
      },
      header: header(PPTransactionType.POST_EFTPOS),
    };
  },
};

export const PPEftCancelRequestModel = {
  toRequest(params: { transactionId: string; totalAmount: number }): PPRequest {
    return {
      data: { total_amount: params.totalAmount },
      header: header(PPTransactionType.POST_EFTPOS_CANCEL, {
        transactionId: params.transactionId,
      }),
    };
  },
};

export const PPOrderPaymentRequestModel = {
  toRequest(params: { orderCode: string }): PPRequest {
    return {
      header: header(PPTransactionType.ORDER_PAYMENT, {
        orderCode: params.orderCode,
      }),
    };
  },
};

export const PPAvailablePaymentMethodsRequestModel = {
  toRequest(): PPRequest {
    return {
      header: header(PPTransactionType.AVAILABLE_PAYMENT_METHODS),
    };
  },
};

export const PPEodRequestModel = {
  toRequest(params?: { types?: PPEodType[]; isAll?: boolean }): PPRequest {
    return {
      data: { types: params?.types ?? [], is_all: params?.isAll ?? false },
      header: header(PPTransactionType.EOD),
    };
  },
};

export const PPParameterRequestModel = {
  toRequest(params?: {
    types?: PPParameterTypes[];
    isAll?: boolean;
  }): PPRequest {
    return {
      data: { types: params?.types ?? [], is_all: params?.isAll ?? false },
      header: header(PPTransactionType.PARAMETERS),
    };
  },
};

export const PPMultiPaymentRequest = {
  toRequest(params: {
    changePaymentStatus: boolean;
    orderCode: string;
    orderDate: Date;
    products: ProductModel[];
    transactions: TransactionModel[];
    billingInformation?: PPBillingInfo;
    groupCode?: string;
    note?: string;
    hash?: string;
    orderNumber?: string;
    userId?: string;
    specialCode?: string;
    startTime?: number;
    discountAmount?: number;
    currency?: PPCurrencyType;
    deliveryStatus?: PPDeliveryStatusEnum;
    deliveryType?: PPDeliveryTypeEnum;
    installment?: number;
    canTryAgain?: boolean;
  }): PPRequest {
    return {
      data: {
        note: params.note,
        user_id: params.userId,
        currency: params.currency ?? PPCurrencyType.TRY,
        customer: billingToJson(params.billingInformation),
        hash: params.hash,
        products: params.products.map(productToJson),
        group_code: params.groupCode,
        order_code: params.orderCode,
        order_date: formatOrderDate(params.orderDate),
        start_time: params.startTime,
        installment: params.installment,
        order_number: params.orderNumber,
        special_code: params.specialCode,
        transactions: params.transactions.map(transactionToJson),
        delivery_type: params.deliveryType ?? PPDeliveryTypeEnum.CASH_ORDER,
        delivery_status: params.deliveryStatus,
        discount_amount: params.discountAmount ?? 0,
        change_payment_status: params.changePaymentStatus,
        can_try_again: params.canTryAgain ?? true,
      },
      header: header(PPTransactionType.ORDER_MULTI_PAYMENT),
    };
  },
};
