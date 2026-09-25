import api from './api';

export const patientService = {
  async addPatient(patientData) {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  async getPatients(search = '') {
    const response = await api.get('/patients', {
      params: search ? { search } : {}
    });
    return response.data;
  },

  async getPatientById(id) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async getPatientAnalyses(id) {
    const response = await api.get(`/patients/${id}/analyses`);
    return response.data;
  }
};
