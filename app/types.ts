export type ApplicationType = { 
  id: string; 
  project: string; 
  status: string; 
  department: string; 
  applicant: string; 
  date: string; 
  progress: number; 
  approved_by?: string[]; 
};
