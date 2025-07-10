import React, { useState, useMemo, useEffect } from 'react';

// Utility function to format numbers as LKR currency.
const formatCurrency = (amount) => `LKR ${amount ? amount.toLocaleString() : '0'}`;

// Redesigned component to focus solely on Fee Tracking.
const AttendanceAndFees = ({ 
  data, 
  onPaymentUpdate // This prop comes from App.js and handles the actual update logic
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // This memoized value calculates the list to display based on the central `data` prop.
  // It will automatically re-calculate whenever the data from App.js changes.
  const studentFeeStatusList = useMemo(() => {
    if (!selectedClass || !data.students || !data.payments || !data.classes) {
      return [];
    }

    const studentsInClass = data.students.filter(s => 
      s.enrolled_classes.includes(parseInt(selectedClass))
    );

    const classInfo = data.classes.find(c => c.id === parseInt(selectedClass));
    if (!classInfo) return [];

    return studentsInClass.map(student => {
      const paymentRecord = data.payments.find(p => 
        p.student_id === student.id &&
        p.class_id === parseInt(selectedClass) &&
        p.month === selectedMonth
      );

      if (paymentRecord) {
        return { student, payment: paymentRecord };
      } else {
        // Create a default "Pending" record for display if one doesn't exist
        return {
          student,
          payment: {
            student_id: student.id,
            class_id: parseInt(selectedClass),
            month: selectedMonth,
            status: 'Pending',
            amount: classInfo.fee_per_month,
            payment_date: null,
          }
        };
      }
    });
  }, [selectedClass, selectedMonth, data.students, data.payments, data.classes]);

  // Simplified handler that calls the function passed down from App.js
  const handlePaymentClick = (payment) => {
    const newStatus = payment.status === 'Paid' ? 'Pending' : 'Paid';
    // Call the centralized handler in App.js
    onPaymentUpdate(payment, newStatus);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Fee Tracking</h1>
        <p>Manage monthly fee payments for each class.</p>
      </div>

      {/* --- UPDATED: Filters for Month and Class with new style --- */}
      <div className="filter-toolbar" style={{ gridTemplateColumns: '1fr 2fr', marginBottom: '24px' }}>
        <input 
          type="month" 
          className="form-control" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <select className="form-control" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">-- Select a class to view fees --</option>
          {data.classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
        </select>
      </div>

      {/* Fee Status Table */}
      {selectedClass ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Contact Number</th>
              <th>Fee Amount</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentFeeStatusList.map(({ student, payment }) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.contact_number}</td>
                <td>{formatCurrency(payment.amount)}</td>
                <td>
                  <span className={`status-badge ${payment.status === 'Paid' ? 'status-badge--paid' : 'status-badge--pending'}`}>
                    {payment.status}
                  </span>
                </td>
                <td style={{textAlign: 'center'}}>
                  <button 
                    className={`btn btn--xs ${payment.status === 'Paid' ? 'btn--outline' : 'btn--success'}`} 
                    onClick={() => handlePaymentClick(payment)}
                  >
                    {payment.status === 'Paid' ? 'Mark as Pending' : 'Mark as Paid'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state dashboard-card">
          <h3>Please select a class to view fee information.</h3>
        </div>
      )}
    </div>
  );
};

export default AttendanceAndFees;