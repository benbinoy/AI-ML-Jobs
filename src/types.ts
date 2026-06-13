/**
 * Shared Type Definitions for AI/ML Job Aggregator
 */

export type LocationType = 'Kochi' | 'Bangalore' | 'All';
export type ExperienceLevelType = 'All' | 'Entry Level' | 'Mid Level' | 'Senior Level';

export interface ValidationDetails {
  syntaxCheck: string;
  mxRecords: string[];
  smtpLog: string;
}

export interface JobPosting {
  id: string;
  job_title: string;
  company_name: string;
  location: 'Kochi' | 'Bangalore';
  date_posted: string; // ISO 8601 representation
  job_url: string;
  experience_level?: 'Entry Level' | 'Mid Level' | 'Senior Level';
  
  // Enrichment fields
  brief_history?: string;
  contact_number?: string;
  email_id?: string;
  enrichment_status: 'pending' | 'enriching' | 'completed' | 'failed';
  enrichment_error?: string;
  
  // Email Validation fields
  email_validity?: boolean;
  syntax_valid?: boolean;
  mx_valid?: boolean;
  smtp_valid?: boolean;
  validation_status: 'pending' | 'validating' | 'completed' | 'failed';
  validation_details?: ValidationDetails;
  validation_error?: string;
}

export interface AggregatorStats {
  totalJobs: number;
  kochiCount: number;
  bangaloreCount: number;
  enrichedCount: number;
  validEmailsCount: number;
  invalidEmailsCount: number;
  pendingValidationCount: number;
}
