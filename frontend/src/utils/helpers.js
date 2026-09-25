export const formatConditionName = (key) => {
  const mapping = {
    complex_cyst: "Complex Cyst",
    dominant_follicle: "Dominant Follicle",
    healthy: "Healthy Ovarian Tissue",
    poly_cyst: "Polycystic Ovary (PCOS)",
    simple_cyst: "Simple Cyst"
  };
  return mapping[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getConditionBadgeColor = (key) => {
  switch (key) {
    case 'healthy':
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' };
    case 'dominant_follicle':
      return { bg: 'rgba(72, 202, 228, 0.15)', text: '#48CAE4', border: 'rgba(72, 202, 228, 0.3)' };
    case 'simple_cyst':
      return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
    case 'complex_cyst':
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' };
    case 'poly_cyst':
      return { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' };
    default:
      return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8', border: 'rgba(148, 163, 184, 0.3)' };
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
