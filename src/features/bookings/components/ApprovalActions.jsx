import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

/**
 * ApprovalActions
 * Approve or decline a held request. Declining requires a modal so the
 * slot-release consequence is explicit.
 */
const ApprovalActions = ({ booking, onApprove, onDecline, disabled = false }) => {
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await onApprove(booking.id);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmDecline = async () => {
    setProcessing(true);
    try {
      await onDecline(booking.id, declineReason);
      setDeclineModalOpen(false);
      setDeclineReason('');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="approval-actions">
        <Button
          variant="primary"
          size="small"
          onClick={handleApprove}
          loading={processing}
          disabled={disabled || processing}
        >
          Approve
        </Button>
        <Button
          variant="ghost-danger"
          size="small"
          onClick={() => setDeclineModalOpen(true)}
          disabled={disabled || processing}
        >
          Decline
        </Button>
      </div>

      <Modal
        isOpen={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        title="Decline request"
        size="small"
      >
        <p>
          Declining releases the held window immediately and notifies the customer. This cannot be undone.
        </p>

        <div className="form-group">
          <label htmlFor={`decline-reason-${booking.id}`} className="form-label">
            Reason (optional)
          </label>
          <textarea
            id={`decline-reason-${booking.id}`}
            className="form-textarea"
            rows={3}
            placeholder="e.g. Room reserved for scheduled maintenance."
            value={declineReason}
            onChange={(event) => setDeclineReason(event.target.value)}
            disabled={processing}
          />
        </div>

        <div className="modal-actions">
          <Button variant="outline" onClick={() => setDeclineModalOpen(false)} disabled={processing}>
            Keep request
          </Button>
          <Button variant="danger" onClick={handleConfirmDecline} loading={processing} disabled={processing}>
            Decline & release
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ApprovalActions;
