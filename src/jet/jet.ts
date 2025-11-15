export interface Intent<TPayload = unknown> {
  type: string;
  payload: TPayload;
  meta?: Record<string, unknown>;
}

export interface Action<TPayload = unknown> {
  type: string;
  payload: TPayload;
  meta?: Record<string, unknown>;
}

export interface Jet {
  dispatch(intent: Intent<unknown>): Promise<unknown> | unknown;
  perform(action: Action<unknown>): Promise<unknown> | unknown;
}

export const jet: Jet = {
  dispatch(intent) {
    // TODO: wire up intent handlers (task, category, etc.)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[jet.dispatch] Unhandled intent', intent);
    }
    return undefined;
  },

  perform(action) {
    // TODO: wire up action handlers for UI side-effects
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[jet.perform] Unhandled action', action);
    }
    return undefined;
  },
};
