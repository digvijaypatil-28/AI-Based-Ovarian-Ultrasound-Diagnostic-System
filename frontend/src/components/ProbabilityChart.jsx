import React from 'react';
import { formatConditionName, getConditionBadgeColor } from '../utils/helpers';
import { BarChart2 } from 'lucide-react';

const ProbabilityChart = ({ probabilities, topPrediction }) => {
  if (!probabilities) return null;

  const entries = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '1rem', fontWeight: 600 }}>
        <BarChart2 size={20} />
        <span>Class Probability Distribution</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {entries.map(([key, value]) => {
          const isTop = key === topPrediction;
          const style = getConditionBadgeColor(key);
          const formattedName = formatConditionName(key);
          const percent = typeof value === 'number' ? value : parseFloat(value);

          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: isTop ? 700 : 400, color: isTop ? '#FFF' : 'var(--text-muted)' }}>
                  {formattedName} {isTop && <span style={{ color: 'var(--accent)', fontSize: '0.75rem', marginLeft: '6px' }}>(Primary)</span>}
                </span>
                <span style={{ fontWeight: 700, color: style.text }}>
                  {percent.toFixed(2)}%
                </span>
              </div>

              {/* Bar track */}
              <div style={{
                height: '10px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.max(percent, 1)}%`,
                  background: isTop
                    ? `linear-gradient(90deg, ${style.text} 0%, var(--accent) 100%)`
                    : style.text,
                  borderRadius: '6px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isTop ? `0 0 10px ${style.text}` : 'none'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProbabilityChart;
