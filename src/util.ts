const isMacintosh = navigator.userAgent.includes('Macintosh');

export const modifiers = {
  c: 'c',
  s: 's',
  a: 'a',
  m: 'm',
  ctrl: 'c',
  control: 'c', // macOS
  shift: 's',
  alt: 'a',
  meta: 'm',
  ctrlcmd: isMacintosh ? 'm' : 'c',
};

export const aliases = {
  arrowup: 'up',
  arrowdown: 'down',
  arrowleft: 'left',
  arrowright: 'right',
  enter: 'cr',
  escape: 'esc',
  ' ': 'space',
};

export interface IShortcutModifiers {
  c?: boolean;
  s?: boolean;
  a?: boolean;
  m?: boolean;
}

export interface IShortcutCondition {
  field: string;
  not: boolean;
}

export interface IShortcut {
  conditions?: IShortcutCondition[];
  callback: () => void;
}

export function reprKey(base: string, mod: IShortcutModifiers = {}) {
  const {
    c, s, a, m,
  } = mod;
  base = aliases[base] || base;
  return [
    m && 'm',
    c && 'c',
    s && 's',
    a && 'a',
    base,
  ].filter(Boolean).join('-');
}

export function normalizeKey(shortcut: string, caseSensitive = false) {
  const parts = shortcut.split('-');
  let base = parts.pop();
  const modifierState = {};
  for (const part of parts) {
    const key = modifiers[part.toLowerCase()];
    if (!key) throw new Error(`Unknown modifier key: ${part}`);
    modifierState[key] = true;
  }
  if (!caseSensitive || base.length > 1) base = base.toLowerCase();
  return reprKey(base, modifierState);
}

export function normalizeSequence(sequence: string, caseSensitive: boolean) {
  return sequence.split(' ').map(key => normalizeKey(key, caseSensitive));
}

export function parseCondition(condition: string): IShortcutCondition[] {
  return condition.split('&&')
    .map(key => {
      key = key.trim();
      if (!key) return;
      if (key[0] === '!') {
        return { not: true, field: key.slice(1).trim() };
      }
      return { not: false, field: key };
    })
    .filter(Boolean);
}
