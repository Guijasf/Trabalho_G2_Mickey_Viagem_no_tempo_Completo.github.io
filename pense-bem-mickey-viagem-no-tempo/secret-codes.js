export const SECRET_CODES = { ELO: '151', HISTORIA: '152', INVENTOS: '153', AMERICAS: '154', EGITO: '155', ORIGINAL: null };
export const emptySecret = () => ({ armed: false, buffer: '', lastKey: 0 });
// Pure parser: Shift arms; letters can be typed with Shift held or released.
export function readSecret(state, event, now) {
  if (event.editable || event.ctrlKey || event.altKey || event.metaKey) return { state: emptySecret() };
  if (event.repeat) return { state };
  if (event.key === 'Shift') return { state: { armed: true, buffer: '', lastKey: now } };
  if (!state.armed || now - state.lastKey > 6000 || !/^[a-z]$/i.test(event.key)) return { state: emptySecret() };
  const buffer = state.buffer + event.key.toUpperCase();
  if (Object.hasOwn(SECRET_CODES, buffer)) return { state: emptySecret(), matched: true, themeCode: SECRET_CODES[buffer] };
  return { state: Object.keys(SECRET_CODES).some(code => code.startsWith(buffer)) ? { armed: true, buffer, lastKey: now } : emptySecret() };
}
