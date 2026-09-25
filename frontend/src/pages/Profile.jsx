import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';
import { User, Mail, Calendar, ShieldCheck, Cpu } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFF', margin: '0 0 4px 0' }}>
          Clinician Profile
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Manage your account credentials and system privileges
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontSize: '1.8rem',
            fontWeight: 700,
            boxShadow: '0 0 20px rgba(0, 180, 216, 0.4)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', margin: '0 0 4px 0' }}>{user.name}</h2>
            <div style={{ fontSize: '0.88rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              <span>Authorized Medical System User</span>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail size={18} color="var(--text-muted)" />
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFF' }}>{user.email}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={18} color="var(--text-muted)" />
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Account Created Date</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFF' }}>{formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Spec Card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.95rem', fontWeight: 600 }}>
          <Cpu size={18} />
          <span>Active AI Model Architecture</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
          <div>Model: <strong style={{ color: '#FFF' }}>ResNet18 (Torchvision)</strong></div>
          <div>Input Shape: <strong style={{ color: '#FFF' }}>224 x 224 x 3</strong></div>
          <div>Classification Classes: <strong style={{ color: '#FFF' }}>5 Classes</strong></div>
          <div>Explainability: <strong style={{ color: '#FFF' }}>Grad-CAM (Layer4)</strong></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
