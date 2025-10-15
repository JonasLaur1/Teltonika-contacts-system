export const validatePassword = (password: string) => {
  if (!password) return 'Įveskite slaptažodį';
  if (password.length < 8) return 'Slaptažodis turi būti bent 8 simbolių';
  return '';
};

export const validatePasswordConfirm = (password: string, confirm: string) => {
  if (!confirm) return 'Patvirtinkite slaptažodį';
  if (password !== confirm) return 'Slaptažodžiai nesutampa';
  return '';
};

export const validateEmail = (email: string) => {
  if (!email) return 'Įveskite el. paštą';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Neteisingas el. paštas';
  return '';
};