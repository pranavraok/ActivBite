export type AdminReportRecord = {
  id: string;
  uploadedAt: string;
  reportName: string;
  category: string;
  reportDate: string;
  fileName: string;
  fileUrl: string;
  fileId: string;
  notes: string;
  uploadedBy: string;
};

export const REPORT_CATEGORIES = [
  'Nutrition test',
  'Food safety',
  'Lab report',
  'Certification',
  'Packaging',
  'Other',
] as const;
