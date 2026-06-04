import Native from './NativePluspayA2aReactNative';
import { PPA2AException } from './models/exceptions';
import type { PPRequest } from './models/requests';
import type {
  PPEodResponse,
  PPMultiPaymentResponse,
  PPOrderPaymentResponse,
  PPParametersResponse,
  PPStartPaymentResponse,
} from './models/responses';

/**
 * Main client for PlusPay POS+ App2App (A2A) integration (Android only).
 *
 * Usage:
 * ```ts
 * const pp = new PPA2AClient();
 * await pp.initialize();
 * try {
 *   const res = await pp.startPayment(
 *     PPStartPaymentRequestModel.toRequest({
 *       orderCode: 'ORD001',
 *       totalAmount: 100,
 *       paymentType: PPPaymentType.POS,
 *       paymentMethod: PPPaymentMethod.CC,
 *     }),
 *   );
 * } catch (e) {
 *   if (e instanceof PPA2AException) console.log(e.errorCode, e.message);
 * }
 * ```
 */
export class PPA2AClient {
  private initialized = false;
  packageName?: string;
  activityName?: string;

  /** Must be called once before any request. Registers the result receiver. */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      const infoStr = await Native.initialize();
      const info = infoStr ? JSON.parse(infoStr) : {};
      this.packageName = info.packageName;
      this.activityName = info.activityName;
      this.initialized = true;
    } catch (e: any) {
      throw new PPA2AException(
        e?.code ?? 'INIT_ERROR',
        e?.message ?? String(e)
      );
    }
  }

  private async send(request: PPRequest): Promise<any> {
    if (!this.initialized) {
      throw new PPA2AException(
        'NOT_INITIALIZED',
        'PPA2AClient.initialize() must be called first.'
      );
    }

    let responseStr: string;
    try {
      responseStr = await Native.sendRequest(JSON.stringify(request));
    } catch (e: any) {
      throw new PPA2AException(
        e?.code ?? 'LAUNCH_INTENT_ERROR',
        e?.message ?? String(e)
      );
    }

    let response: any;
    try {
      response = responseStr ? JSON.parse(responseStr) : {};
    } catch (_) {
      throw new PPA2AException('PP-A2A-PARSE', 'Failed to parse response JSON');
    }

    if (response?.error_code) {
      throw new PPA2AException(
        response.error_code,
        response.error_message ?? 'Unknown error'
      );
    }
    return response;
  }

  /** Start a payment on POS+. */
  startPayment(request: PPRequest): Promise<PPStartPaymentResponse> {
    return this.send(request);
  }

  /** Cancel a payment on POS+. */
  cancelPayment(request: PPRequest): Promise<PPStartPaymentResponse> {
    return this.send(request);
  }

  /** Start an EFT POS payment. */
  startEftPayment(request: PPRequest): Promise<PPStartPaymentResponse> {
    return this.send(request);
  }

  /** Cancel an EFT POS payment. */
  cancelEftPayment(request: PPRequest): Promise<PPStartPaymentResponse> {
    return this.send(request);
  }

  /** Start an order payment flow on POS+. */
  startOrderPayment(request: PPRequest): Promise<PPOrderPaymentResponse> {
    return this.send(request);
  }

  /** Start a multi payment flow on POS+. */
  startMultiPayment(request: PPRequest): Promise<PPMultiPaymentResponse> {
    return this.send(request);
  }

  /** Trigger end-of-day (EOD) on POS+. */
  triggerEod(request: PPRequest): Promise<PPEodResponse> {
    return this.send(request);
  }

  /** Trigger parameter update on POS+. */
  triggerParameters(request: PPRequest): Promise<PPParametersResponse> {
    return this.send(request);
  }

  /** Stop listening and clean up native resources. */
  async dispose(): Promise<void> {
    try {
      await Native.dispose();
    } finally {
      this.initialized = false;
    }
  }
}
