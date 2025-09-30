import type Employee from '@/types/Employee';
import defaultPhoto from '@/assets/images/profile.svg'

export function getEmployeePhoto(employee: Employee): string {
  return employee.photo
    ? `/base_url/api/files/${employee.collectionId}/${employee.id}/${employee.photo}`
    : defaultPhoto;
}