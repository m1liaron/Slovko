let onUnauthorized: (() => void) | null = null;

const registerUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

const triggerUnauthorized = () => {
  if (onUnauthorized) onUnauthorized();
};

export { registerUnauthorizedHandler, triggerUnauthorized };
