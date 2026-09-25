import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import PatientCard from '../components/PatientCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, UserPlus, X, AlertCircle } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPatients = async (query = '') => {
    try {
      const data = await patientService.getPatients(query);
      setPatients(data);
    } catch (err) {
      console.error('Failed to load patients', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(search);
  }, [search]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await patientService.addPatient({
        name,
        age: parseInt(age, 10),
        gender
      });
      setName('');
      setAge('');
      setGender('Female');
      setShowModal(false);
      fetchPatients(search);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add patient record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFF', margin: '0 0 4px 0' }}>
            Patient Directory
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
            Manage registered patients and access diagnostic files
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary">
          <UserPlus size={18} />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name or code (e.g. PAT-0001)..."
          className="glass-input"
          style={{ border: 'none', background: 'transparent', padding: '0' }}
        />
      </div>

      {/* Content Grid */}
      {loading ? (
        <LoadingSpinner text="Loading patient directory..." />
      ) : patients.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.05rem', margin: '0 0 12px 0' }}>No patient records found.</p>
          <button onClick={() => setShowModal(true)} className="btn-secondary">
            <UserPlus size={16} />
            <span>Create First Patient Record</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {patients.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}

      {/* Add Patient Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 19, 43, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', margin: 0 }}>Register New Patient</h2>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddPatient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>Patient Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>Age</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 28"
                    className="glass-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="glass-input"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Female" style={{ background: '#1C2541' }}>Female</option>
                    <option value="Male" style={{ background: '#1C2541' }}>Male</option>
                    <option value="Other" style={{ background: '#1C2541' }}>Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1 }}>
                  {saving ? 'Saving...' : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
