import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { analysisService } from '../services/analysisService';
import UploadBox from '../components/UploadBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, User, AlertCircle, Play } from 'lucide-react';

const NewAnalysis = () => {
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patient_id') || '';

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loadingPatients, setLoadingPatients] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await patientService.getPatients();
        setPatients(data);
        if (!selectedPatientId && data.length > 0) {
          setSelectedPatientId(data[0].id.toString());
        }
      } catch (err) {
        setError('Failed to load patient records.');
      } finally {
        setLoadingPatients(false);
      }
    };
    loadPatients();
  }, []);

  const handleAnalyze = async () => {
    setError('');

    if (!selectedPatientId) {
      setError('Please select a patient before analyzing.');
      return;
    }

    if (!selectedFile) {
      setError('Please upload an ultrasound image.');
      return;
    }

    setAnalyzing(true);

    try {
      const result = await analysisService.runAnalysis(selectedPatientId, selectedFile);
      navigate(`/analysis/${result.analysis_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please check image and try again.');
      setAnalyzing(false);
    }
  };

  if (loadingPatients) return <LoadingSpinner text="Preparing analysis studio..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-fade-in">
      {/* Page Title Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FFF', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="var(--accent)" />
          <span>New AI Ultrasound Analysis</span>
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0 }}>
          Upload patient ovarian ultrasound scan for ResNet18 neural network classification and Grad-CAM explainability overlay.
        </p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px 16px', color: '#EF4444', fontSize: '0.9rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Patient Selection Box */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="var(--accent)" />
          <span>Select Target Patient</span>
        </label>

        {patients.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No registered patients found. Please add a patient first.
          </div>
        ) : (
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="glass-input"
            style={{ fontSize: '0.98rem', fontWeight: 500 }}
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#1C2541' }}>
                {p.name} ({p.patient_code}) — {p.age} yrs, {p.gender}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Image Upload Area */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFF', margin: 0 }}>
          Ultrasound Image Upload
        </h3>

        <UploadBox
          selectedFile={selectedFile}
          onFileSelect={(file) => setSelectedFile(file)}
          onClear={() => setSelectedFile(null)}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={handleAnalyze}
        disabled={analyzing || !selectedFile || !selectedPatientId}
        className="btn-primary"
        style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '12px' }}
      >
        {analyzing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid #FFF',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span>Analyzing ultrasound scan with ResNet18 model...</span>
          </div>
        ) : (
          <>
            <Play size={20} />
            <span>Run AI Ultrasound Analysis</span>
          </>
        )}
      </button>
    </div>
  );
};

export default NewAnalysis;
