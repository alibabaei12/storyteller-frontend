import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/config";
import "../styles/FeedbackModal.css";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState("bug");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'rate-limit'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || message.trim().length < 5) {
      setSubmitStatus("error");
      return;
    }

    if (message.length > 500) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Get Firebase auth token
      const user = auth.currentUser;
      if (!user) {
        setSubmitStatus("error");
        return;
      }

      const token = await user.getIdToken(true);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";

      const response = await fetch(`${apiUrl}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feedback_type: feedbackType,
          message: message.trim(),
          contact_email: contactEmail.trim(),
        }),
      });

      if (response.status === 429) {
        setSubmitStatus("rate-limit");
      } else if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setMessage("");
        setContactEmail("");
        setFeedbackType("bug");
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-header">
          <h3>Send Feedback</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="feedbackType">Type of Feedback</label>
            <select
              id="feedbackType"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="feedback-select"
            >
              <option value="bug">🐛 Bug Report</option>
              <option value="feature">💡 Feature Request</option>
              <option value="general">💬 General Feedback</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Your Message <span className="required">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your feedback, bug, or suggestion..."
              className="feedback-textarea"
              rows={4}
              maxLength={500}
              required
            />
            <div className="char-count">{message.length}/500 characters</div>
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">
              Contact Email <span className="optional">(optional)</span>
            </label>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="feedback-input"
              maxLength={100}
            />
          </div>

          {submitStatus === "success" && (
            <div className="feedback-status success">
              ✅ Thank you! Your feedback has been submitted successfully.
            </div>
          )}

          {submitStatus === "rate-limit" && (
            <div className="feedback-status error">
              ⏱️ Rate limit exceeded. You can submit up to 3 feedback messages
              per day, with 10 minutes between submissions.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="feedback-status error">
              ❌ Failed to submit feedback. Please check your message is 5-500
              characters long and try again.
            </div>
          )}

          <div className="feedback-actions">
            <button type="button" onClick={onClose} className="btn secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim() || message.length > 500}
              className="btn primary"
            >
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </form>

        <div className="feedback-info">
          <p>
            <strong>Rate Limits:</strong> Max 3 submissions per day, 1 per 10
            minutes
          </p>
          <p>
            <strong>Privacy:</strong> We only store what's necessary to address
            your feedback
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
