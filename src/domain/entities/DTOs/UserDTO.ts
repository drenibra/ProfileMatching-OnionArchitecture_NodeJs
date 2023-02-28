export interface UserDTO {
  id: string;
  name: string;
  lastName: string;
  email: string;
  photo?: string;
  role: 'applicant' | 'recruiter' | 'admin';
}
