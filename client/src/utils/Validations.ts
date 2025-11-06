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

export const validatePersonName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return 'Įveskite vardą/pavardę';
  if (trimmed.length < 2) return 'Vardas/pavardė turi būti bent iš 2 simbolių';
  if (trimmed.length > 50) return 'Vardas/pavardė negali būti ilgesnis nei 50 simbolių';
  if (!/^[A-Za-zÀ-ž]+$/.test(trimmed)) return 'Vardas/pavardė gali turėti tik raides';
  return '';
};

export const validateName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return 'Įveskite reikšmę';
  if (trimmed.length < 2) return 'Reikšmė turi būti bent iš 2 simbolių';
  if (trimmed.length > 50) return 'Reikšmė negali būti ilgesnis nei 50 simbolių';
  if (!/^[A-Za-zÀ-ž0-9&.,''\-\/\s]+$/.test(trimmed)) return 'Naudojami neleistini simboliai';
  return '';
};

export const validateStreet = (street: string) => validateName(street);
export const validateCity = (city: string) => validateName(city);
export const validateCountry = (country: string) => validateName(country);

export const validateStreetNumber = (streetNumber: string) => {
  if (!streetNumber || !streetNumber.trim()) return 'Įveskite pastato numerį';
  if (!/^[\d\s\-]+[A-Za-z]{0,2}$/.test(streetNumber.trim())) return 'Pastato numeris gali turėti tik skaičius, tarpo ir brūkšnio simbolius bei iki dviejų raidžių pabaigoje';
  return '';
};