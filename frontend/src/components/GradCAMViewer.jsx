import React from 'react';
import { Eye, Info } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

const GradCAMViewer = ({ originalImageUrl, gradcamImageUrl }) => {
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const origFull = getFullUrl(originalImageUrl);
  const gradFull = getFullUrl(gradcamImageUrl);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '1rem', fontWeight: 600 }}>
          <Eye size={20} />
          <span>Explainable AI Spatial Analysis (Grad-CAM)</span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          ResNet18 Layer4 Visual Activation
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Original Ultrasound */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: '#000',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={origFull}
              alt="Original Ultrasound"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <span style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Original Ultrasound Image
          </span>
        </div>

        {/* Grad-CAM Heatmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(72, 202, 228, 0.3)',
            background: '#000',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 180, 216, 0.2)'
          }}>
            <img
              src={gradFull}
              alt="Grad-CAM Visualization"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <span style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>
            Grad-CAM Heatmap Overlay
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        background: 'rgba(0, 180, 216, 0.08)',
        border: '1px solid rgba(0, 180, 216, 0.2)',
        borderRadius: '10px',
        padding: '12px 16px',
        fontSize: '0.82rem',
        color: '#93E5F6'
      }}>
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Grad-CAM Interpretation:</strong> The highlighted warm-color regions (red/yellow) indicate spatial feature maps in the ultrasound image that contributed most significantly to the model's output prediction. Grad-CAM is an explainability feature map and is not an automated medical segmentation mask.
        </div>
      </div>
    </div>
  );
};

export default GradCAMViewer;
