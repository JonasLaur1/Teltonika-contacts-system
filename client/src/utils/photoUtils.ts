import type Employee from "@/types/Employee";
import type User from "@/types/User";
import defaultPhoto from "@/assets/images/profile.svg";
import defaultProfilePhoto from "@/assets/images/userProfile.svg";

export function getEmployeePhoto(
  employee: Employee | User | null,
  context: "navbar" | "card" = "card"
): string {
  if (!employee) {
    return context === "navbar" ? defaultProfilePhoto : defaultPhoto;
  }

  if ("avatar" in employee && employee.avatar) {
    return `/base_url/api/files/${employee.collectionId}/${employee.id}/${employee.avatar}`;
  }

  if ("photo" in employee && employee.photo) {
    return `/base_url/api/files/${employee.collectionId}/${employee.id}/${employee.photo}`;
  }

  return context === "navbar" ? defaultProfilePhoto : defaultPhoto;
}
