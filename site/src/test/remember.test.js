import { beforeEach, describe, expect, it } from 'vitest';
import { isRemembered, rememberedEmail, setRemember } from '../Redux/store';

describe('Recordarme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('sin marcar no recuerda nada', () => {
    setRemember(false, 'ana@example.com');
    expect(isRemembered()).toBe(false);
    expect(rememberedEmail()).toBe('');
  });

  it('marcado guarda la preferencia y el correo', () => {
    setRemember(true, 'ana@example.com');
    expect(isRemembered()).toBe(true);
    expect(rememberedEmail()).toBe('ana@example.com');
  });

  it('al desmarcar se olvida el correo', () => {
    setRemember(true, 'ana@example.com');
    setRemember(false, 'ana@example.com');
    expect(isRemembered()).toBe(false);
    expect(rememberedEmail()).toBe('');
  });
});
