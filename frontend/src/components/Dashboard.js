import React from 'react';

// Utility function to format numbers as LKR currency.
const formatCurrency = (amount) => `LKR ${amount ? amount.toLocaleString() : '0'}`;

// The Dashboard component displays an overview of the application data.
const Dashboard = ({ data, onNavigate }) => {
  const { students = [], classes = [], payments = [] } = data;
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // --- Calculations for Dashboard Stats ---
  const todaysClasses = classes.filter(cls => cls.day === currentDay);
  const pendingPayments = payments.filter(payment => payment.status === 'Pending');
  
  // **FIX**: Calculate actual paid revenue for the current month for real-time updates.
  const currentMonth = new Date().toISOString().slice(0, 7);
  const revenueThisMonth = payments
    .filter(p => p.month === currentMonth && p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  // Style object for the stat cards to make them square and have a thicker border
  const statCardStyle = {
    border: '2px solid var(--color-border)',
    aspectRatio: '1 / 1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="current-date">{currentDate}</p>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '50px', marginBottom: '100px' }}>
        <div className="dashboard-card stat-card" style={statCardStyle}>
          <div className="stat-card__value">{students.length}</div>
          <div className="stat-card__label">Total Students</div>
        </div>
        <div className="dashboard-card stat-card" style={statCardStyle}>
          <div className="stat-card__value">{classes.length}</div>
          <div className="stat-card__label">Total Classes</div>
        </div>
        <div className="dashboard-card stat-card" style={statCardStyle}>
          <div className="stat-card__value" style={{color: 'var(--color-success)'}}>{formatCurrency(revenueThisMonth)}</div>
          <div className="stat-card__label">Revenue This Month</div>
        </div>
        <div className="dashboard-card stat-card" style={statCardStyle}>
          <div className="stat-card__value pending-payments">{pendingPayments.length}</div>
          <div className="stat-card__label">Pending Payments</div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3 style={{marginBottom: '20px'}}>Today's Classes</h3>
        <div className="today-classes">
          {todaysClasses.length > 0 ? (
            todaysClasses.map(cls => (
              <div key={cls.id} className="class-item">
                <div className="class-item__info">
                  <h4>{cls.name}</h4>
                  <p>{cls.time} • {students.filter(s => s.enrolled_classes.includes(cls.id)).length} students</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state"><p>No classes scheduled for today.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
