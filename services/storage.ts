
import { CorruptionReport } from '../types';

const STORAGE_KEY = 'whistle_sa_reports';

export const storageService = {
  getReports: (): CorruptionReport[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveReport: (report: CorruptionReport): void => {
    const reports = storageService.getReports();
    const existingIndex = reports.findIndex(r => r.id === report.id);
    
    if (existingIndex > -1) {
      reports[existingIndex] = report;
    } else {
      reports.push(report);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  getReportById: (id: string): CorruptionReport | undefined => {
    return storageService.getReports().find(r => r.id === id);
  },

  getReportByPin: (pin: string): CorruptionReport | undefined => {
    return storageService.getReports().find(r => r.trackingPin === pin);
  },

  clearAllReports: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    // Force a reload or state update would be handled in the UI
  }
};
