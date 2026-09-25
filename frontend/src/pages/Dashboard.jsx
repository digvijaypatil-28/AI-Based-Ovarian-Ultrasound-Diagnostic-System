import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { analysisService } from '../services/analysisService';
import { reportService } from '../services/reportService';
import { formatDate, formatConditionName, getConditionBadgeColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Activity, PlusCircle, ArrowRight, FileText, Download, ShieldCheck, Eye } from 'lucide-react';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [patientsData, analysesData] = await Promise.all([
          patientService.getPatients(),
          analysisService.getHistory()
        ]);
        setPatients(patientsData);
        setAnalyses(analysesData);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDownloadPdf = async (analysisId) => {
    try {
      await reportService.downloadReportPdf(analysisId);
    } catch (err) {
      alert('Failed to download PDF report.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard analytics..." />;

  const recentAnalyses = analyses.slice(0, 5);
  const recentPatients = patients.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(0, 119, 182, 0.25) 0%, rgba(0, 180, 216, 0.1) 100%)',
        border: '1px solid rgba(72, 202, 228, 0.25)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FFF', margin: '0 0 6px 0' }}>
            Clinical Decision Support Dashboard
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0 }}>
            Real-time ResNet18 AI ultrasound classification metrics & patient history
          </p>
        </div>

        <Link to="/new-analysis" className="btn-primary" style={{ padding: '12px 24px' }}>
          <PlusCircle size={20} />
          Start New Analysis
        </Link>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '14px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {error}
        </div>
      )}

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Total Patients Card */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(72, 202, 228, 0.12)',
            border: '1px solid rgba(72, 202, 228, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Registered Patients</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>{patients.length}</div>
          </div>
        </div>

        {/* Total Analyses Card */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(0, 180, 216, 0.12)',
            border: '1px solid rgba(0, 180, 216, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-teal)'
          }}>
            <Activity size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total AI Diagnostics Completed</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>{analyses.length}</div>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
        {/* Recent Analyses Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFF', fontSize: '1.1rem', fontWeight: 600 }}>
              <Activity size={20} color="var(--accent)" />
              <span>Recent AI Diagnostic Runs</span>
            </div>
            <Link to="/history" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No ultrasound analyses completed yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentAnalyses.map((item) => {
                const badgeStyle = getConditionBadgeColor(item.prediction);
                return (
                  <div key={item.analysis_id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFF' }}>
                          {item.patient_name || `Patient #${item.patient_id}`}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: badgeStyle.bg,
                          color: badgeStyle.text,
                          border: `1px solid ${badgeStyle.border}`
                        }}>
                          {formatConditionName(item.prediction)} ({item.confidence.toFixed(1)}%)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link to={`/analysis/${item.analysis_id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="View Result">
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => handleDownloadPdf(item.analysis_id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="Download PDF">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Patients Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFF', fontSize: '1.1rem', fontWeight: 600 }}>
              <Users size={20} color="var(--accent)" />
              <span>Recently Registered Patients</span>
            </div>
            <Link to="/patients" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentPatients.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No patients registered yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentPatients.map((patient) => (
                <div key={patient.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFF', margin: '0 0 2px 0' }}>{patient.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {patient.patient_code} • Age {patient.age} ({patient.gender})
                    </span>
                  </div>

                  <Link to={`/patients/${patient.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    Open File
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
