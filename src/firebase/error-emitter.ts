// A simple event emitter to broadcast errors globally in the application.
// This allows us to decouple the error source from the error handler.

type Listener<T> = (payload: T) => void;

class EventEmitter<TEventMap> {
  private listeners: { [K in keyof TEventMap]?: Listener<TEventMap[K]>[] } = {};

  on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }

  emit<K extends keyof TEventMap>(event: K, payload: TEventMap[K]) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach(listener => listener(payload));
  }
}

// Define the types of errors our app can emit.
interface ErrorEventMap {
  'permission-error': import('./errors').FirestorePermissionError;
}

// Create a singleton instance of the event emitter.
export const errorEmitter = new EventEmitter<ErrorEventMap>();
    