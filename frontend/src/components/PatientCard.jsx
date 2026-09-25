import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Activity, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const PatientCard = ({ patient }) => {
  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(72, 202, 228, 0.1)',
            border: '1px solid rgba(72, 202, 228, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <User size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFF', margin: 0 }}>{patient.name}</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600, background: 'rgba(0, 180, 216, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
              {patient.patient_code}
            </span>
          </div>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {patient.gender}, {patient.age} yrs
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="var(--accent)" />
          <span>{patient.analysis_count || 0} Analyses</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} />
          <span>{formatDate(patient.created_at)}</span>
        </div>
      </div>

      <Link
        to={`/patients/${patient.id}`}
        className="btn-secondary"
        style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px 14px' }}
      >
        <span>View Patient File</span>
        <ChevronRight size={16} />
      </Link>
    </div>
  );
};

export default PatientCard;
