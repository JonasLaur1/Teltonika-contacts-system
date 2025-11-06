import { ref, computed } from "vue";
import { validatePersonName, validateName, validateEmail } from "@/utils/Validations";
import { trimText } from "@/utils/textTrimming";
import type Employee from "@/types/Employee";

export function useContactForm(props: { mode?: "create" | "edit"; employee?: Employee | null }) {
  const name = ref("");
  const surname = ref("");
  const position = ref("");
  const email = ref("");
  const phoneNumber = ref("");
  const selectedFile = ref<File | null>(null);
  const currentAvatar = ref<string | File | null>(null);
  const errors = ref<Record<string, string>>({});
  const isLoading = ref(false);

  const selectedFilters = ref({
    company: null as string | null,
    office: null as string | null,
    division: null as string | null,
    department: null as string | null,
    group: null as string | null,
  });

  const headerText = computed(() => 
    props.mode === "edit" ? "Redaguoti kontaktą:" : "Pridėti kontaktą:"
  );

  const submitButtonText = computed(() => {
    if (isLoading.value) {
      return props.mode === "edit" ? "ATNAUJINAMA..." : "PRIDEDAMA...";
    }
    return props.mode === "edit" ? "ATNAUJINTI" : "PRIDĖTI";
  });

  const buttonText = computed(() => 
    selectedFile.value ? "Pakeisti nuotrauką" : "Įkelti nuotrauką"
  );

  const canSubmit = computed(() => {
    const basicValid =
      validatePersonName(name.value) === "" &&
      validatePersonName(surname.value) === "" &&
      validateName(position.value) === "" &&
      validateEmail(email.value) === "" &&
      selectedFilters.value.company !== null &&
      selectedFilters.value.office !== null &&
      selectedFilters.value.division !== null;

    return !isLoading.value && basicValid;
  });

  const validateForm = (): boolean => {
    errors.value = {};
    
    const nameError = validatePersonName(name.value);
    if (nameError) errors.value.name = nameError;
    
    const surnameError = validatePersonName(surname.value);
    if (surnameError) errors.value.surname = surnameError;
    
    const positionError = validateName(position.value);
    if (positionError) errors.value.position = positionError;
    
    const emailError = validateEmail(email.value);
    if (emailError) errors.value.email = emailError;

    if (!selectedFilters.value.company) errors.value.company = "Pasirinkite įmonę";
    if (!selectedFilters.value.office) errors.value.office = "Pasirinkite ofisą";
    if (!selectedFilters.value.division) errors.value.division = "Pasirinkite padalinį";

    return Object.keys(errors.value).length === 0;
  };

  const initializeForm = () => {
    if (props.mode === "edit" && props.employee) {
      const e = props.employee;
      name.value = e.name;
      surname.value = e.surname;
      position.value = e.position;
      email.value = e.email;
      phoneNumber.value = e.phone_number || "";
      currentAvatar.value = e.photo || null;
      selectedFilters.value = {
        company: e.company_id || null,
        office: e.office_id || null,
        division: e.division_id || null,
        department: e.department_id || null,
        group: e.group_id || null,
      };
    }
  };

  const handleFiltersChanged = (filters: typeof selectedFilters.value) => {
    selectedFilters.value = filters;
    if (filters.company) errors.value.company = "";
    if (filters.office) errors.value.office = "";
    if (filters.division) errors.value.division = "";
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    selectedFile.value = target.files?.[0] ?? null;
    if (target) target.value = "";
  };

  const buildEmployeeData = () => ({
    name: trimText(name.value),
    surname: trimText(surname.value),
    position: trimText(position.value),
    email: trimText(email.value),
    phone_number: trimText(phoneNumber.value),
    company_id: selectedFilters.value.company,
    office_id: selectedFilters.value.office,
    division_id: selectedFilters.value.division,
    department_id: selectedFilters.value.department,
    group_id: selectedFilters.value.group,
    photo: selectedFile.value,
  });

  const hasChanges = (): boolean => {
    if (!props.employee) return true;
    
    return (
      name.value !== props.employee.name ||
      surname.value !== props.employee.surname ||
      position.value !== props.employee.position ||
      email.value !== props.employee.email ||
      phoneNumber.value !== (props.employee.phone_number || "") ||
      selectedFilters.value.company !== props.employee.company_id ||
      selectedFilters.value.office !== props.employee.office_id ||
      selectedFilters.value.division !== props.employee.division_id ||
      selectedFilters.value.department !== props.employee.department_id ||
      selectedFilters.value.group !== props.employee.group_id ||
      selectedFile.value !== null
    );
  };

  return {
    name,
    surname,
    position,
    email,
    phoneNumber,
    selectedFile,
    currentAvatar,
    errors,
    isLoading,
    selectedFilters,
    headerText,
    submitButtonText,
    buttonText,
    canSubmit,
    validateForm,
    initializeForm,
    handleFiltersChanged,
    handleFileChange,
    buildEmployeeData,
    hasChanges,
  };
}