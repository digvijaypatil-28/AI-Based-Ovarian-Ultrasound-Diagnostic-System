import api from './api';

export const reportService = {
  async downloadReportPdf(analysisId, filename = `Ovarian_Analysis_Report_${analysisId}.pdf`) {
    const response = await api.get(`/reports/${analysisId}/pdf`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
