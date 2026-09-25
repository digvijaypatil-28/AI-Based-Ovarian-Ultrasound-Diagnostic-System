import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { patientService } from '../services/patientService';
import { reportService } from '../services/reportService';
import PredictionCard from '../components/PredictionCard';
import ProbabilityChart from '../components/ProbabilityChart';
import GradCAMViewer from '../components/GradCAMViewer';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatConditionName } from '../utils/helpers';
import { Download, User, Calendar, FileText, ArrowLeft, Activity } from 'lucide-react';

const CONDITION_SUMMARIES = {
  complex_cyst: "The ResNet18 model identified feature patterns consistent with a complex ovarian cyst containing mixed cystic and solid acoustic characteristics.",
  dominant_follicle: "The ResNet18 model identified feature patterns consistent with a dominant follicle, a normal physiological structure during the follicular phase.",
  healthy: "The ResNet18 model identified normal, healthy ovarian parenchymal architecture without focal cystic or solid structural alterations.",
  poly_cyst: "The ResNet18 model identified multiple small peripheral sonolucent regions indicative of polycystic ovarian morphology (PCOS pattern).",
  simple_cyst: "The ResNet18 model identified features consistent with a simple thin-walled fluid-filled cyst showing smooth margins."
};

const AnalysisResult = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const anaData = await analysisService.getAnalysisById(id);
        setAnalysis(anaData);
        if (anaData.patient_id) {
          const patData = await patientService.getPatientById(anaData.patient_id);
          setPatient(patData);
        }
      } catch (err) {
        setError('Failed to load analysis result.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysisData();
  }, [id]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await reportService.downloadReportPdf(id);
    } catch (err) {
      alert('Error generating or downloading PDF report.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Rendering AI diagnostic report..." />;
  if (error || !analysis) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
        <p>{error || 'Analysis record not found.'}</p>
        <Link to="/history" className="btn-secondary" style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} />
          Back to History
        </Link>
      </div>
    );
  }

  const summaryText = CONDITION_SUMMARIES[analysis.prediction] || "AI classification complete.";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-fade-in">
      {/* Top Navigation & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <Link to="/history" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          Back to History
        </Link>

        <button onClick={handleDownloadPdf} disabled={downloading} className="btn-primary" style={{ padding: '12px 20px' }}>
          <Download size={18} />
          <span>{downloading ? 'Generating Report...' : 'Download PDF Report'}</span>
        </button>
      </div>

      {/* Title Header Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(0, 119, 182, 0.2) 0%, rgba(0, 180, 216, 0.08) 100%)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={24} color="var(--accent)" />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFF', margin: 0 }}>
              AI Ultrasound Diagnostic Result
            </h1>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Analysis ID: #{analysis.analysis_id} • Executed on {formatDate(analysis.created_at)}
          </span>
        </div>

        {patient && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <User size={20} color="var(--accent)" />
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFF' }}>{patient.name}</span>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {patient.patient_code} • Age {patient.age} ({patient.gender})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout: Prediction & Probability Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <PredictionCard prediction={analysis.prediction} confidence={analysis.confidence} />
        <ProbabilityChart probabilities={analysis.probabilities} topPrediction={analysis.prediction} />
      </div>

      {/* Grad-CAM Explainable AI Visualization */}
      <GradCAMViewer originalImageUrl={analysis.original_image_url} gradcamImageUrl={analysis.gradcam_image_url} />

      {/* AI-Assisted Clinical Summary */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFF', fontSize: '1.05rem', fontWeight: 600 }}>
          <FileText size={20} color="var(--accent)" />
          <span>AI-Assisted Finding Summary</span>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>
          {summaryText}
        </p>
      </div>
    </div>
  );
};

export default AnalysisResult;
