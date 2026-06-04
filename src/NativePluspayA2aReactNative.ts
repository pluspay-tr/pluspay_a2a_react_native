import { TurboModuleRegistry, type TurboModule } from 'react-native';

/**
 * Thin native bridge for PlusPay POS+ App2App (A2A).
 *
 * The bridge only transports raw JSON: it sends the A2A intent to POS+ and
 * resolves with the raw response JSON received via BroadcastReceiver.
 * All models / serialization live in TypeScript (see ./models).
 */
export interface Spec extends TurboModule {
  /**
   * Registers the result BroadcastReceiver and returns app info as a JSON
   * string: `{"packageName": "...", "activityName": "..."}`.
   */
  initialize(): Promise<string>;

  /**
   * Launches POS+ with the given request JSON and resolves with the raw
   * response JSON string once POS+ broadcasts back the result.
   */
  sendRequest(requestJson: string): Promise<string>;

  /** Unregisters the receiver and clears state. */
  dispose(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('PluspayA2aReactNative');
