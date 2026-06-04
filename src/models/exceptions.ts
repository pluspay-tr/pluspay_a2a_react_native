/**
 * Thrown when POS+ returns an error (`error_code` / `error_message`) or when
 * the A2A intent cannot be launched.
 */
export class PPA2AException extends Error {
  readonly errorCode: string;

  constructor(errorCode: string, message: string) {
    super(message);
    this.name = 'PPA2AException';
    this.errorCode = errorCode;
    // Restore prototype chain (TS target < ES2015 safety).
    Object.setPrototypeOf(this, PPA2AException.prototype);
  }

  override toString(): string {
    return `PPA2AException(${this.errorCode}): ${this.message}`;
  }
}
