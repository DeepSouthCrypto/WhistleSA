
export enum ReportStatus {
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  INVESTIGATING = 'Investigating',
  SIU_HANDOVER = 'SIU Handover',
  HAWKS_HANDOVER = 'HAWKS Handover',
  RESOLVED = 'Resolved',
  REJECTED = 'Insufficient Evidence'
}

export enum CorruptionCategory {
  BRIBERY = 'Bribery',
  FRAUD = 'Fraud',
  NEPOTISM = 'Nepotism / Favouritism',
  EXTORTION = 'Extortion',
  MONEY_LAUNDERING = 'Money Laundering',
  PROCUREMENT_IRREGULARITY = 'Procurement Irregularity',
  OTHER = 'Other'
}

export interface ReportEvidence {
  id: string;
  dataUrl: string;
  mimeType: string;
  timestamp: number;
}

export interface CorruptionReport {
  id: string;
  title: string;
  description: string;
  category: CorruptionCategory;
  agency: 'SIU' | 'HAWKS' | 'PENDING';
  status: ReportStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  aiSummary: string;
  evidence: ReportEvidence[];
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  submittedAt: number;
  lastUpdated: number;
  trackingPin: string; // Used for anonymous lookup
}

export interface SecurityAuditItem {
  id: string;
  task: string;
  completed: boolean;
  severity: 'Critical' | 'High' | 'Medium';
}
