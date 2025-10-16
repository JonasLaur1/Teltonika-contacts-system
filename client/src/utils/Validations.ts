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

export const validateName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return 'Įveskite pavadinimą';
  if (trimmed.length < 2) return 'Pavadinimas turi būti bent iš 2 simbolių.'
  if (trimmed.length > 50) return 'Pavadinimas negali būti ilgesnis nei 50 simbolių'
  if (!/^[A-Za-zÀ-ž0-9&.,'’\-\/\s]+$/.test(trimmed)) return 'Naudojami neleistini simboliai';
  return '';
}
