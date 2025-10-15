import type Employee from '@/types/Employee';
import defaultPhoto from '@/assets/images/profile.svg'
import defaultProfilePhoto from '@/assets/images/userProfile.svg'

export function getEmployeePhoto(employee: Employee | null, context: 'navbar' | 'card' = 'card'): string {  
  if (employee.photo || employee.avatar) {
    const photo = context === 'navbar' ? employee.avatar : employee.photo
    return `/base_url/api/files/${employee.collectionId}/${employee.id}/${photo}`;
  }
  
  return context === 'navbar' ? defaultProfilePhoto : defaultPhoto;
}