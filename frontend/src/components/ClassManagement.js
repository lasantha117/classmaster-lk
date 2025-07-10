import React, { useState } from 'react';
import Modal from './Modal';

const formatCurrency = (amount) => `LKR ${amount ? amount.toLocaleString() : '0'}`;

const ClassManagement = ({ data, onAddClass, onUpdateClass, onDeleteClass, showNotification }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  const initialFormState = { name: '', subject: '', grade: '', day: '', time: '', fee_per_month: '' };
  const [newClass, setNewClass] = useState(initialFormState);

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddClass({ ...newClass, fee_per_month: parseInt(newClass.fee_per_month, 10) });
    setNewClass(initialFormState);
    setShowAddForm(false);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    onUpdateClass({ ...editingClass, fee_per_month: parseInt(editingClass.fee_per_month, 10) });
    setEditingClass(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingClass) return;
    onDeleteClass(deletingClass.id);
    setDeletingClass(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Class Management</h1>
        <p>Add, edit, or remove classes from your schedule.</p>
      </div>
      <div className="filter-bar" style={{ marginBottom: '24px', justifyContent: 'flex-start' }}>
        <button className="btn btn--primary" onClick={() => setShowAddForm(true)}>+ Add New Class</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Subject</th>
            <th>Schedule</th>
            <th>Students</th>
            <th>Monthly Fee</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.classes.map(cls => (
            <tr key={cls.id}>
              <td>{cls.name}</td>
              <td>{cls.subject}</td>
              <td>{cls.day}, {cls.time}</td>
              <td>{data.students.filter(s => s.enrolled_classes.includes(cls.id)).length}</td>
              <td>{formatCurrency(cls.fee_per_month)}</td>
              <td style={{ textAlign: 'center' }}>
                <button className="btn btn--xs btn--outline" onClick={() => setEditingClass({ ...cls })}>Edit</button>
                <button className="btn btn--xs btn--error" style={{ marginLeft: '8px' }} onClick={() => setDeletingClass(cls)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.classes.length === 0 && <div className="empty-state"><h3>No classes created yet.</h3></div>}

      {/* Add Class Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add New Class">
        <form onSubmit={handleAddSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Class Name *</label>
              <input type="text" name="name" className="form-control" value={newClass.name} onChange={(e) => handleInputChange(e, setNewClass)} required placeholder="e.g., 2026 A/L Physics" />
            </div>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input type="text" name="subject" className="form-control" value={newClass.subject} onChange={(e) => handleInputChange(e, setNewClass)} required placeholder="e.g., Physics" />
            </div>
            <div className="form-group">
              <label className="form-label">Grade/Level *</label>
              <select name="grade" className="form-control" value={newClass.grade} onChange={(e) => handleInputChange(e, setNewClass)} required>
                <option value="">Select Grade</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="A/L">A/L</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Day *</label>
              <select name="day" className="form-control" value={newClass.day} onChange={(e) => handleInputChange(e, setNewClass)} required>
                <option value="">Select Day</option>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Time *</label>
              <input type="text" name="time" className="form-control" value={newClass.time} onChange={(e) => handleInputChange(e, setNewClass)} required placeholder="e.g., 4:00 PM - 6:00 PM" />
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Fee (LKR) *</label>
              <input type="number" name="fee_per_month" className="form-control" value={newClass.fee_per_month} onChange={(e) => handleInputChange(e, setNewClass)} required placeholder="e.g., 8000" />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary">Add Class</button>
          </div>
        </form>
      </Modal>

      {/* Edit Class Modal */}
      <Modal isOpen={!!editingClass} onClose={() => setEditingClass(null)} title="Edit Class">
        {editingClass && (
          <form onSubmit={handleUpdateSubmit}>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Class Name *</label><input type="text" name="name" className="form-control" value={editingClass.name} onChange={(e) => handleInputChange(e, setEditingClass)} required /></div>
              <div className="form-group"><label className="form-label">Subject *</label><input type="text" name="subject" className="form-control" value={editingClass.subject} onChange={(e) => handleInputChange(e, setEditingClass)} required /></div>
              <div className="form-group"><label className="form-label">Monthly Fee (LKR) *</label><input type="number" name="fee_per_month" className="form-control" value={editingClass.fee_per_month} onChange={(e) => handleInputChange(e, setEditingClass)} required /></div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--secondary" onClick={() => setEditingClass(null)}>Cancel</button>
              <button type="submit" className="btn btn--primary">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingClass} onClose={() => setDeletingClass(null)} title="Confirm Delete">
        {deletingClass && (
          <div>
            <p>Are you sure you want to delete <strong>{deletingClass.name}</strong>? This action cannot be undone.</p>
            <div className="form-actions">
              <button type="button" className="btn btn--secondary" onClick={() => setDeletingClass(null)}>Cancel</button>
              <button type="button" className="btn btn--error" onClick={handleDeleteConfirm}>Confirm Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClassManagement;