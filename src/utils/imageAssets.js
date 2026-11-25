import heroCyber from '../assets/images/hero-cyber.jpg';
import roomFuturistic from '../assets/images/room-futuristic.jpg';
import labFuturistic from '../assets/images/lab-futuristic.jpg';
import evHangar from '../assets/images/ev-hangar.jpg';
import equipmentBay from '../assets/images/equipment-bay.jpg';

export const IMAGES = {
  heroCyber,
  roomFuturistic,
  labFuturistic,
  evHangar,
  equipmentBay,
};

/**
 * Returns a high-res futuristic image URL based on resource type
 */
export const getResourceImage = (type) => {
  switch (type) {
    case 'MEETING_ROOM':
      return roomFuturistic;
    case 'LABORATORY':
      return labFuturistic;
    case 'EV_CHARGER':
    case 'PARKING':
      return evHangar;
    case 'EQUIPMENT':
      return equipmentBay;
    case 'DESK':
    default:
      return heroCyber;
  }
};

export default IMAGES;
