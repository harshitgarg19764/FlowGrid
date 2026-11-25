import Icon from '../../../components/ui/Icon';

/**
 * OrganisationStats
 * A four-cell ledger of the numbers that drive the operator's day.
 */
const OrganisationStats = ({ stats = {} }) => {
  const total = stats.totalResources ?? 0;
  const available = stats.availableResources ?? 0;
  const availability = total > 0 ? Math.round((available / total) * 100) : 0;

  const cells = [
    {
      label: 'Resources',
      value: total,
      icon: 'box',
      note: 'Records on the grid',
    },
    {
      label: 'Available now',
      value: available,
      icon: 'circleCheck',
      note: `${availability}% of the ledger`,
    },
    {
      label: 'Pending approvals',
      value: stats.pendingApprovals ?? 0,
      icon: 'clock',
      note: 'Held windows awaiting a call',
    },
    {
      label: 'Upcoming bookings',
      value: stats.upcomingBookings ?? 0,
      icon: 'calendar',
      note: 'Next seven days',
    },
  ];

  return (
    <dl className="stat-grid">
      {cells.map((cell) => (
        <div key={cell.label} className="stat-tile">
          <dt className="stat-label">
            <Icon name={cell.icon} size={15} />
            {cell.label}
          </dt>
          <dd className="stat-value">{cell.value}</dd>
          <dd className="stat-foot">{cell.note}</dd>
        </div>
      ))}
    </dl>
  );
};

export default OrganisationStats;
