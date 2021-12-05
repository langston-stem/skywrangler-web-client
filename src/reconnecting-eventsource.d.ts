declare module "reconnecting-eventsource" {
  type ReconnectingEventSourceInit = EventSourceInit & {
    max_retry_time?: number;
  };

  export default class ReconnectingEventSource implements EventSource {
    constructor(
      url: string | URL,
      eventSourceInitDict?: ReconnectingEventSourceInit
    );
    onerror: ((this: EventSource, ev: Event) => any) | null;
    onmessage: ((this: EventSource, ev: MessageEvent) => any) | null;
    onopen: ((this: EventSource, ev: Event) => any) | null;
    /**
     * Returns the state of this EventSource object's connection. It can have the values described below.
     */
    readonly readyState: number;
    /**
     * Returns the URL providing the event stream.
     */
    readonly url: string;
    /**
     * Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
     */
    readonly withCredentials: boolean;
    /**
     * Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED.
     */
    close(): void;
    readonly CLOSED: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
    addEventListener<K extends keyof EventSourceEventMap>(
      type: K,
      listener: (this: EventSource, ev: EventSourceEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof EventSourceEventMap>(
      type: K,
      listener: (this: EventSource, ev: EventSourceEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
}
