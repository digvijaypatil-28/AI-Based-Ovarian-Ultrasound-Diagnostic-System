import api from './api';

export const analysisService = {
  async runAnalysis(patientId, imageFile) {
    const formData = new FormData();
    formData.append('patient_id', patientId);
    formData.append('file', imageFile);

    const response = await api.post('/analysis/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getHistory() {
    const response = await api.get('/analysis/history');
    return response.data;
  },

  async getAnalysisById(analysisId) {
    const response = await api.get(`/analysis/${analysisId}`);
    return response.data;
  }
};
