/**
 * Response models. POS+ returns snake_case JSON; these interfaces describe the
 * fields as received (no key remapping) plus an index signature so any extra
 * field POS+ adds stays accessible. Error responses are surfaced as
 * `PPA2AException` by the client before these are returned.
 */

export interface PPA2AResponse {
  [key: string]: any;
}

export interface PPStartPaymentResponse extends PPA2AResponse {
  status?: string;
  order_code?: string;
  total_amount?: number;
  total_paid?: number;
  amount_due?: number;
  is_partial?: boolean;
  partial_type?: string;
  card_number_masked?: string;
  rrn?: string;
  payment_type?: string;
  payment_method?: string;
}

export interface PPOrderPaymentResponse extends PPA2AResponse {
  status?: string;
  completed?: boolean;
  order_code?: string;
  total_amount?: number;
  total_paid?: number;
  amount_due?: number;
  grand_total?: number;
  results?: any[];
}

export interface PPEodResponse extends PPA2AResponse {
  success?: boolean;
  error_message?: string;
  results?: any[];
}

export interface PPParametersResponse extends PPA2AResponse {
  completed?: boolean;
  error_message?: string;
  results?: any[];
}

export interface PPMultiPaymentResponse extends PPA2AResponse {
  order_code?: string;
  status?: string;
  grand_total?: number;
  total_paid?: number;
  products?: any[];
  transactions?: any[];
}

export interface PPPaymentTypeMethods {
  code?: string;
  methods?: string[];
  title?: string | null;
}

export interface PPAvailablePaymentMethodsResponse extends PPA2AResponse {
  payment_types?: PPPaymentTypeMethods[];
}
