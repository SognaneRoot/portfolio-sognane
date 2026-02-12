// Service simple pour la gestion des rapports - SUPPRIMÉ
// Utilisez SimpleFileService à la place
export class ReportService {
  static async debugReports(): Promise<void> {
    console.warn('ReportService est obsolète. Utilisez SimpleFileService.debugReports() à la place.');
  }
  
  static async hasReportForProject(projectId: string): Promise<boolean> {
    console.warn('ReportService est obsolète. Utilisez SimpleFileService.hasReportForProject() à la place.');
    return false;
  }
  
  static async openProjectReport(projectId: string): Promise<boolean> {
    console.warn('ReportService est obsolète. Utilisez SimpleFileService.openProjectReport() à la place.');
    return false;
  }
}