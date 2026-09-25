import React from 'react';
import { ShieldCheck, Brain, AlertTriangle } from 'lucide-react';
import { formatConditionName, getConditionBadgeColor } from '../utils/helpers';

const PredictionCard = ({ prediction, confidence }) => {
  const badgeStyle = getConditionBadgeColor(prediction);
  const formattedName = formatConditionName(prediction);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.88rem', fontWeight: 600 }}>
          <Brain size={18} />
          <span>ResNet18 Deep Neural Network Classification</span>
        </div>
        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '20px' }}>
          Deterministic Inference
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Top Predicted Condition
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFF', margin: '4px 0 0 0' }}>
            {formattedName}
          </h2>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Model Confidence
          </span>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: badgeStyle.text,
            textShadow: `0 0 15px ${badgeStyle.border}`
          }}>
            {confidence ? confidence.toFixed(2) : '0.00'}%
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: '10px',
        padding: '12px 16px',
        fontSize: '0.82rem',
        color: '#FCD34D'
      }}>
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Decision Support Notice:</strong> This AI-assisted prediction is provided as a clinical decision-support reference and does not replace evaluation by a licensed healthcare professional.
        </span>
      </div>
    </div>
  );
};

export default PredictionCard;
