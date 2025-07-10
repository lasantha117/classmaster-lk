import React, { useState, useEffect } from 'react';
import { sampleData } from './data'; // Import local data
import Dashboard from './components/Dashboard';
import ClassManagement from './components/ClassManagement';
import StudentManagement from './components/StudentManagement';
import AttendanceAndFees from './components/AttendanceAndFees';
import Reports from './components/Reports';

// --- INLINE SVG ICONS ---
const Icon = ({ children }) => <span className="sidebar__nav-icon">{children}</span>;
const LayoutDashboardIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg></Icon>;
const BookOpenIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></Icon>;
const UsersIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></Icon>;
const CreditCardIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg></Icon>;
const FileTextIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg></Icon>;
const MoonIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg></Icon>;
const SunIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg></Icon>;


const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [data, setData] = useState(sampleData); // Use local data
  const [isLoading, setIsLoading] = useState(false); // No need for loading state
  const [notification, setNotification] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // --- Handlers now modify local state directly ---

  const handleAddStudent = (student) => {
    const newStudent = { ...student, id: Date.now() };
    setData(prev => ({ ...prev, students: [...prev.students, newStudent] }));
    showNotification('Student added successfully!');
  };
  
  const handleAddClass = (newClass) => {
    const newClassWithId = { ...newClass, id: Date.now() };
    setData(prev => ({ ...prev, classes: [...prev.classes, newClassWithId] }));
    showNotification('Class added successfully!');
  };

  const handleUpdateStudent = (student) => {
    setData(prev => ({ ...prev, students: prev.students.map(s => s.id === student.id ? student : s) }));
    showNotification('Student updated successfully!');
  };

  const handleDropStudent = (studentId) => {
    setData(prev => ({ ...prev, students: prev.students.filter(s => s.id !== studentId) }));
    showNotification('Student dropped successfully!');
  };

  const handleUpdateClass = (cls) => {
    setData(prev => ({ ...prev, classes: prev.classes.map(c => c.id === cls.id ? cls : c) }));
    showNotification('Class updated successfully!');
  };

  const handleDeleteClass = (classId) => {
    setData(prev => ({ ...prev, classes: prev.classes.filter(c => c.id !== classId) }));
    showNotification('Class deleted successfully!');
  };

  const handlePaymentUpdate = (payment, newStatus) => {
    setData(prev => {
        const paymentExists = prev.payments.some(p => 
          p.student_id === payment.student_id && 
          p.class_id === payment.class_id && 
          p.month === payment.month
        );

        if (paymentExists) {
          return {
            ...prev,
            payments: prev.payments.map(p => 
              (p.student_id === payment.student_id && p.class_id === payment.class_id && p.month === payment.month)
                ? { ...p, status: newStatus, payment_date: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : null }
                : p
            )
          };
        } else {
          const newPaymentRecord = {
            ...payment,
            status: newStatus,
            payment_date: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : null
          };
          return { ...prev, payments: [...prev.payments, newPaymentRecord] };
        }
      });
      showNotification('Payment status updated!');
  };

  const renderCurrentPage = () => {
    const pageProps = { data, showNotification };
    switch (currentPage) {
      case 'dashboard': return <Dashboard {...pageProps} />;
      case 'classes': return <ClassManagement {...pageProps} onAddClass={handleAddClass} onUpdateClass={handleUpdateClass} onDeleteClass={handleDeleteClass} />;
      case 'students': return <StudentManagement {...pageProps} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onDropStudent={handleDropStudent} />;
      case 'fee-tracking': return <AttendanceAndFees {...pageProps} onPaymentUpdate={handlePaymentUpdate} />;
      case 'reports': return <Reports {...pageProps} />;
      default: return <Dashboard {...pageProps} />;
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const sidebarPages = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon /> },
      { id: 'classes', label: 'Classes', icon: <BookOpenIcon /> },
      { id: 'students', label: 'Students', icon: <UsersIcon /> },
      { id: 'fee-tracking', label: 'Fee Tracking', icon: <CreditCardIcon /> },
      { id: 'reports', label: 'Reports', icon: <FileTextIcon /> }
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand"><h1>ClassMaster</h1></div>
        <nav className="sidebar__nav">
          <ul>
            {sidebarPages.map(page => (
              <li key={page.id} className="sidebar__nav-item">
                <a href="#" className={`sidebar__nav-link ${currentPage === page.id ? 'sidebar__nav-link--active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage(page.id); }}>
                  {page.icon}
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="theme-switcher">
            <button className="btn" onClick={toggleTheme}>
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                <span style={{marginLeft: '8px'}}>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </button>
        </div>
      </aside>
      <main className="main-content">
        {notification && <div className="success-message">{notification}</div>}
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default App;
