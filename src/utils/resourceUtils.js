export const RESOURCE_TYPE_LABELS = {
  MEETING_ROOM: 'Meeting room',
  LABORATORY: 'Laboratory',
  EQUIPMENT: 'Equipment',
  PARKING: 'Parking',
  EV_CHARGER: 'EV charger',
  DESK: 'Workspace',
  OTHER: 'Facility',
};

export const RESOURCE_TYPE_ICONS = {
  MEETING_ROOM: 'building',
  LABORATORY: 'flask',
  EQUIPMENT: 'wrench',
  PARKING: 'car',
  EV_CHARGER: 'bolt',
  DESK: 'grid',
  OTHER: 'box',
};

export const getResourceTypeLabel = (type) =>
  RESOURCE_TYPE_LABELS[type] || (type ? type.replaceAll('_', ' ').toLowerCase() : 'Resource');

export const getResourceTypeIcon = (type) => RESOURCE_TYPE_ICONS[type] || 'box';

export const getResourceStatusLabel = (status) => {
  const labels = {
    AVAILABLE: 'Available',
    UNAVAILABLE: 'Unavailable',
    MAINTENANCE: 'Maintenance',
  };
  return labels[status] || status || 'Unknown';
};
