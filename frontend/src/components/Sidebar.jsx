import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, History, User } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Patients', path: '/patients', icon: Users },
    { label: 'New Analysis', path: '/new-analysis', icon: PlusCircle },
    { label: 'Analysis History', path: '/history', icon: History },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside style={{
      width: '240px',
      minWidth: '240px',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(12px)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px 12px 12px' }}>
        Main Navigation
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.92rem',
              color: isActive ? '#FFF' : 'var(--text-muted)',
              background: isActive ? 'linear-gradient(135deg, rgba(0, 119, 182, 0.4) 0%, rgba(0, 180, 216, 0.2) 100%)' : 'transparent',
              border: isActive ? '1px solid rgba(72, 202, 228, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s ease'
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;
