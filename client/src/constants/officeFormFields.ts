import {
  validateName,
  validateStreet,
  validateStreetNumber,
  validateCity,
  validateCountry,
} from "@/utils/Validations";

export interface OfficeField {
  key: string;
  placeholder: string;
  label: string;
  required: boolean;
  validate: (value: string) => string;
}

export const OFFICE_FIELDS: OfficeField[] = [
  {
    key: "officeName",
    placeholder: "Įveskite ofiso pavadinimą...",
    label: "Pavadinimas:",
    required: true,
    validate: validateName,
  },
  {
    key: "street",
    placeholder: "Įveskite gatvės pavadinimą...",
    label: "Gatvė:",
    required: true,
    validate: validateStreet,
  },
  {
    key: "streetNumber",
    placeholder: "Įveskite pastato numerį...",
    label: "Pastato numeris:",
    required: true,
    validate: validateStreetNumber,
  },
  {
    key: "city",
    placeholder: "Įveskite miestą...",
    label: "Miestas:",
    required: true,
    validate: validateCity,
  },
  {
    key: "country",
    placeholder: "Įveskite šalį...",
    label: "Šalis:",
    required: true,
    validate: validateCountry,
  },
];