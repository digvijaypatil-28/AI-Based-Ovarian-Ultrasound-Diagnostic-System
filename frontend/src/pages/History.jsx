import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { reportService } from '../services/reportService';
import { formatDate, formatConditionName, getConditionBadgeColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { History as HistoryIcon, Eye, Download, Search } from 'lucide-react';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await analysisService.getHistory();
        setAnalyses(data);
      } catch (err) {
        console.error('Failed to load analysis history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDownloadPdf = async (analysisId) => {
    try {
      await reportService.downloadReportPdf(analysisId);
    } catch (err) {
      alert('Error downloading PDF report.');
    }
  };

  const filteredAnalyses = analyses.filter((item) => {
    const term = search.toLowerCase();
    const name = (item.patient_name || '').toLowerCase();
    const code = (item.patient_code || '').toLowerCase();
    const pred = formatConditionName(item.prediction).toLowerCase();
    return name.includes(term) || code.includes(term) || pred.includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFF', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HistoryIcon color="var(--accent)" />
          <span>Analysis History</span>
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Review previous AI ultrasound diagnostic runs and download report documentation
        </p>
      </div>

      {/* Search Input */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter history by patient name, code, or condition..."
          className="glass-input"
          style={{ border: 'none', background: 'transparent', padding: 0 }}
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching diagnostic history log..." />
      ) : filteredAnalyses.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No diagnostic history records match your search query.
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 600 }}>Patient</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600 }}>Prediction</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600 }}>Confidence</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((item) => {
                  const badgeStyle = getConditionBadgeColor(item.prediction);
                  return (
                    <tr key={item.analysis_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#FFF' }}>{item.patient_name || `Patient #${item.patient_id}`}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>{item.patient_code}</div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: badgeStyle.bg,
                          color: badgeStyle.text,
                          border: `1px solid ${badgeStyle.border}`
                        }}>
                          {formatConditionName(item.prediction)}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#FFF' }}>
                        {item.confidence.toFixed(2)}%
                      </td>

                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {formatDate(item.created_at)}
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <Link to={`/analysis/${item.analysis_id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            <Eye size={14} />
                            View
                          </Link>
                          <button onClick={() => handleDownloadPdf(item.analysis_id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            <Download size={14} />
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
