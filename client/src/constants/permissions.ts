export const permissionCategories = [
  {
    title: "Darbuotojai",
    permissions: [
      { key: "edit_employees", label: "Redaguoti ir kurti kontaktus" },
      { key: "delete_employees", label: "Šalinti kontaktus" },
    ],
  },
  {
    title: "Ofisai",
    permissions: [
      { key: "edit_offices", label: "Redaguoti ir kurti ofisus" },
      { key: "delete_offices", label: "Šalinti ofisus" },
    ],
  },
  {
    title: "Struktūra",
    permissions: [
      { key: "edit_structure", label: "Redaguoti ir kurti struktūrą" },
      { key: "delete_structure", label: "Šalinti struktūrą" },
    ],
  },
  {
    title: "Įmonės",
    permissions: [
      { key: "edit_companies", label: "Redaguoti ir kurti įmones" },
      { key: "delete_companies", label: "Šalinti įmones" },
    ],
  },
  {
    title: "Leidimai",
    permissions: [
      { key: "read_permissions", label: "Peržiūrėti leidimus" },
      { key: "edit_permissions", label: "Redaguoti leidimus" },
      { key: "delete_permissions", label: "Šalinti leidimus" },
    ],
  },
];