/**
 * @fileoverview This file defines custom error types for Firebase-related issues,
 * specifically for providing more context on Firestore security rule denials.
 */

/**
 * Defines the context for a Firestore security rule violation. This information
 * is used to construct a detailed error message for developers.
 */
export type SecurityRuleContext = {
  /** The Firestore path of the document or collection being accessed. */
  path: string;
  /** The type of operation that was denied (e.g., 'get', 'list', 'create'). */
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  /** The data being sent with the request (for create/update operations). */
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission errors.
 * It formats the error message to be more informative for developers,
 * including details about the failed request. This is crucial for debugging
 * security rules in a development environment.
 */
export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(
  {
    operation: context.operation,
    path: context.path,
    requestData: context.requestResourceData,
  },
  null,
  2
)}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is necessary for custom errors in TypeScript when targeting ES5
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
    