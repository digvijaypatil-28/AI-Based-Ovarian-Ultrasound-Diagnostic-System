import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const UploadBox = ({ onFileSelect, selectedFile, onClear }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateAndPass = (file) => {
    setError('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload JPG, JPEG, or PNG ultrasound image.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds maximum limit of 15MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {selectedFile ? (
        <div className="glass-panel" style={{ padding: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onClear}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Remove Image"
          >
            <X size={18} />
          </button>

          <div style={{
            maxWidth: '100%',
            maxHeight: '320px',
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid rgba(72, 202, 228, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            <img src={previewUrl} alt="Ultrasound Preview" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.88rem' }}>
            <ImageIcon size={16} />
            <span style={{ fontWeight: 600 }}>{selectedFile.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: dragActive ? '2px dashed var(--accent)' : '2px dashed rgba(255, 255, 255, 0.2)',
            background: dragActive ? 'rgba(72, 202, 228, 0.08)' : 'rgba(15, 23, 42, 0.4)',
            borderRadius: '16px',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(72, 202, 228, 0.1)',
            border: '1px solid rgba(72, 202, 228, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <UploadCloud size={28} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#FFF', margin: '0 0 4px 0' }}>
              Upload Ovarian Ultrasound Image
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Drag & drop image file here, or click to browse files
            </p>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>
            Supports JPG, JPEG, PNG (Max 15MB)
          </span>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadBox;
