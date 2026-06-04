import { describe, expect, it } from '@jest/globals';
import {
  PPCurrencyType,
  PPDeliveryTypeEnum,
  PPEodType,
  PPPaymentMethod,
  PPPaymentType,
  PPProductTypeEnum,
  PPQtyEnums,
  PPTransactionType,
} from '../models/enums';
import {
  PPStartPaymentRequestModel,
  PPEftPaymentRequestModel,
  PPEftCancelRequestModel,
  PPCancelPaymentRequestModel,
  PPOrderPaymentRequestModel,
  PPEodRequestModel,
  PPMultiPaymentRequest,
  formatOrderDate,
} from '../models/requests';

describe('start payment request', () => {
  it('serializes snake_case header + data', () => {
    const r = PPStartPaymentRequestModel.toRequest({
      orderCode: 'ORD1',
      totalAmount: 100,
      paymentType: PPPaymentType.POS,
      paymentMethod: PPPaymentMethod.CC,
    });
    expect(r.header.transaction_type).toBe(PPTransactionType.POST_PAYMENT_START);
    expect(r.header.order_code).toBe('ORD1');
    expect(r.data!.total_amount).toBe(100);
    expect(r.data!.payment_type).toBe('POS');
    expect(r.data!.payment_method).toBe('CC');
    expect(r.data!.is_partial).toBe(false);
  });

  it('billing uses tax_office (not taxOffice)', () => {
    const r = PPStartPaymentRequestModel.toRequest({
      orderCode: 'ORD1',
      totalAmount: 100,
      paymentType: PPPaymentType.POS,
      paymentMethod: PPPaymentMethod.CC,
      billingInformation: {
        name: 'Acme',
        identity: '11111111111',
        taxOffice: 'Kadıköy',
        code: 'C1',
      },
    });
    const billing = r.data!.billing_information;
    expect(billing.tax_office).toBe('Kadıköy');
    expect(billing).not.toHaveProperty('taxOffice');
    expect(billing.code).toBe('C1');
    // undefined optionals are dropped by JSON.stringify
    expect(JSON.parse(JSON.stringify(billing))).not.toHaveProperty('phone');
  });
});

describe('multi payment request', () => {
  const base = {
    changePaymentStatus: true,
    orderCode: 'ORD-MP',
    orderDate: new Date(2026, 5, 4, 9, 5), // 2026-06-04 09:05
    products: [
      {
        id: 1,
        sku: 'SKU1',
        title: 'P1',
        price: 100,
        quantity: 1,
        taxRate: 10,
        unit: PPQtyEnums.ADET,
        vatInclude: true,
        productType: PPProductTypeEnum.PHYSICALLY,
        discountValue: 0,
      },
    ],
    transactions: [
      {
        paymentType: PPPaymentType.POS,
        totalAmount: 100,
        paymentMethod: PPPaymentMethod.CC,
      },
    ],
  };

  it('honors the currency argument (regression for hardcoded TRY bug)', () => {
    const r = PPMultiPaymentRequest.toRequest({
      ...base,
      currency: PPCurrencyType.USD,
    });
    expect(r.data!.currency).toBe('USD');
  });

  it('defaults currency to TRY and delivery to CASH_ORDER', () => {
    const r = PPMultiPaymentRequest.toRequest(base);
    expect(r.data!.currency).toBe('TRY');
    expect(r.data!.delivery_type).toBe(PPDeliveryTypeEnum.CASH_ORDER);
  });

  it('includes otv_orani / konaklama_orani (default 0) and can_try_again', () => {
    const r = PPMultiPaymentRequest.toRequest(base);
    const p = r.data!.products[0];
    expect(p.otv_orani).toBe(0);
    expect(p.konaklama_orani).toBe(0);
    expect(p.tax_rate).toBe(10);
    expect(p.product_type).toBe('PHYSICALLY');
    expect(r.data!.can_try_again).toBe(true);
  });

  it('formats order_date as yyyy-MM-dd HH:mm', () => {
    const r = PPMultiPaymentRequest.toRequest(base);
    expect(r.data!.order_date).toBe('2026-06-04 09:05');
  });

  it('serializes transactions in snake_case', () => {
    const r = PPMultiPaymentRequest.toRequest(base);
    expect(r.data!.transactions[0]).toEqual({
      payment_type: 'POS',
      total_amount: 100,
      payment_method: 'CC',
    });
  });
});

describe('other requests', () => {
  it('eft payment', () => {
    const r = PPEftPaymentRequestModel.toRequest({
      totalAmount: 50,
      paymentType: PPPaymentType.POS,
      paymentMethod: PPPaymentMethod.CC,
      transactionId: 'T1',
      taxRate: 10,
    });
    expect(r.header.transaction_type).toBe(PPTransactionType.POST_EFTPOS);
    expect(r.data!.tax_rate).toBe(10);
    expect(r.data!.transaction_id).toBe('T1');
  });

  it('eft cancel puts transaction_id in header', () => {
    const r = PPEftCancelRequestModel.toRequest({
      transactionId: 'T1',
      totalAmount: 50,
    });
    expect(r.header.transaction_type).toBe(PPTransactionType.POST_EFTPOS_CANCEL);
    expect(r.header.transaction_id).toBe('T1');
    expect(r.data!.total_amount).toBe(50);
  });

  it('cancel payment', () => {
    const r = PPCancelPaymentRequestModel.toRequest({
      orderCode: 'ORD1',
      transactionId: 'T1',
    });
    expect(r.header.transaction_type).toBe(
      PPTransactionType.POST_PAYMENT_CANCEL
    );
    expect(r.data!.transaction_id).toBe('T1');
  });

  it('order payment has header only', () => {
    const r = PPOrderPaymentRequestModel.toRequest({ orderCode: 'ORD1' });
    expect(r.data).toBeUndefined();
    expect(r.header.order_code).toBe('ORD1');
  });

  it('eod sends types + is_all', () => {
    const r = PPEodRequestModel.toRequest({ types: [PPEodType.POS] });
    expect(r.data!.types).toEqual(['POS']);
    expect(r.data!.is_all).toBe(false);
  });
});

describe('formatOrderDate', () => {
  it('pads single digits', () => {
    expect(formatOrderDate(new Date(2026, 0, 2, 3, 4))).toBe('2026-01-02 03:04');
  });
});
