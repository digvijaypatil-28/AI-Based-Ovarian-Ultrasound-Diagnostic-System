import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { reportService } from '../services/reportService';
import { formatDate, formatConditionName, getConditionBadgeColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Calendar, Activity, PlusCircle, Eye, Download, ArrowLeft } from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const [patData, anaData] = await Promise.all([
          patientService.getPatientById(id),
          patientService.getPatientAnalyses(id)
        ]);
        setPatient(patData);
        setAnalyses(anaData);
      } catch (err) {
        setError('Failed to fetch patient details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatientInfo();
  }, [id]);

  const handleDownloadPdf = async (analysisId) => {
    try {
      await reportService.downloadReportPdf(analysisId);
    } catch (err) {
      alert('Failed to download PDF report.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading patient medical file..." />;
  if (error || !patient) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
        <p>{error || 'Patient record not found.'}</p>
        <Link to="/patients" className="btn-secondary" style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} />
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <Link to="/patients" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600 }}>
        <ArrowLeft size={16} />
        Back to Patients Directory
      </Link>

      {/* Patient Header Card */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(72, 202, 228, 0.12)',
            border: '1px solid rgba(72, 202, 228, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <User size={32} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFF', margin: 0 }}>{patient.name}</h1>
              <span style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, background: 'rgba(0, 180, 216, 0.15)', padding: '4px 10px', borderRadius: '6px' }}>
                {patient.patient_code}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span>Age: <strong>{patient.age} yrs</strong></span>
              <span>•</span>
              <span>Gender: <strong>{patient.gender}</strong></span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Registered: {formatDate(patient.created_at)}
              </span>
            </div>
          </div>
        </div>

        <Link to={`/new-analysis?patient_id=${patient.id}`} className="btn-primary">
          <PlusCircle size={18} />
          New Ultrasound Analysis
        </Link>
      </div>

      {/* Analysis History Section */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFF', fontSize: '1.2rem', fontWeight: 600 }}>
            <Activity size={22} color="var(--accent)" />
            <span>Ultrasound Analysis History ({analyses.length})</span>
          </div>
        </div>

        {analyses.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            No ultrasound analyses performed for this patient yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {analyses.map((item) => {
              const badgeStyle = getConditionBadgeColor(item.prediction);
              return (
                <div key={item.analysis_id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`
                      }}>
                        {formatConditionName(item.prediction)}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>
                        Confidence: {item.confidence.toFixed(2)}%
                      </span>
                    </div>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Executed on: {formatDate(item.created_at)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link to={`/analysis/${item.analysis_id}`} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                      <Eye size={16} />
                      View Result
                    </Link>
                    <button onClick={() => handleDownloadPdf(item.analysis_id)} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                      <Download size={16} />
                      Download PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
