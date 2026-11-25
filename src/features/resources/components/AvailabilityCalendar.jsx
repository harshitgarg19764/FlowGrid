import { useState, useMemo } from 'react';
import {
  formatDate,
  formatDateInput,
  generateTimeSlots,
  toISOString,
  formatTime,
} from '../../../utils/dateUtils';

/**
 * AvailabilityCalendar
 * A timetable-style slot picker. Open, held and selected states are
 * encoded in the cell rather than in colour alone.
 */
const AvailabilityCalendar = ({
  slotDurationMinutes = 60,
  bookedSlots = [],
  selectedSlot,
  onSelectSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState(formatDateInput(new Date()));

  const slots = useMemo(() => {
    const baseDate = new Date(`${selectedDate}T00:00:00`);
    return generateTimeSlots(baseDate, slotDurationMinutes, 8, 20);
  }, [selectedDate, slotDurationMinutes]);

  const isSlotBooked = (slot) => {
    return bookedSlots.some((booking) => {
      const bookedStart = new Date(booking.startTime).getTime();
      const bookedEnd = new Date(booking.endTime).getTime();
      const slotStart = slot.start.getTime();
      const slotEnd = slot.end.getTime();
      return slotStart < bookedEnd && slotEnd > bookedStart;
    });
  };

  const handleSlotClick = (slot) => {
    if (isSlotBooked(slot)) return;

    onSelectSlot({
      startTime: toISOString(slot.start),
      endTime: toISOString(slot.end),
      label: `${formatTime(slot.start)} – ${formatTime(slot.end)}`,
    });
  };

  const isSlotSelected = (slot) => {
    if (!selectedSlot) return false;
    return (
      new Date(selectedSlot.startTime).getTime() === slot.start.getTime() &&
      new Date(selectedSlot.endTime).getTime() === slot.end.getTime()
    );
  };

  const openCount = slots.filter((slot) => !isSlotBooked(slot)).length;

  return (
    <section className="calendar-panel" aria-labelledby="availability-heading">
      <div className="calendar-head">
        <div>
          <h2 id="availability-heading">Availability</h2>
          <span className="calendar-head-note">
            {formatDate(selectedDate, 'EEEE d MMMM')} · {openCount} of {slots.length} slots open
          </span>
        </div>

        <div className="date-field">
          <label htmlFor="calendar-date">Date</label>
          <input
            id="calendar-date"
            type="date"
            className="form-input"
            value={selectedDate}
            min={formatDateInput(new Date())}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>
      </div>

      <div className="slot-grid">
        {slots.length === 0 ? (
          <p className="slot-empty">No operating hours are published for this date.</p>
        ) : (
          slots.map((slot) => {
            const booked = isSlotBooked(slot);
            const selected = isSlotSelected(slot);
            const state = booked ? 'Held' : selected ? 'Selected' : 'Open';

            return (
              <button
                key={slot.start.toISOString()}
                type="button"
                className={`slot ${selected ? 'is-selected' : ''}`}
                disabled={booked}
                aria-pressed={selected}
                aria-label={`${formatTime(slot.start)} to ${formatTime(slot.end)} — ${state}`}
                onClick={() => handleSlotClick(slot)}
              >
                <span className="slot-time">{formatTime(slot.start)}</span>
                <span className="slot-state">
                  {booked ? 'Held' : selected ? 'Selected' : `${slotDurationMinutes} min`}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="legend" aria-hidden="true">
        <span className="legend-item">
          <span className="legend-swatch" />
          Open
        </span>
        <span className="legend-item">
          <span className="legend-swatch legend-swatch--selected" />
          Selected
        </span>
        <span className="legend-item">
          <span className="legend-swatch legend-swatch--booked" />
          Held or booked
        </span>
      </div>
    </section>
  );
};

export default AvailabilityCalendar;
