import React, { useState, useEffect, useCallback } from 'react';
// import { LayoutDashboard, BookOpen, Users, CreditCard, FileText, Moon, Sun } from 'lucide-react'; // This line is removed
import Dashboard from './components/Dashboard';
import ClassManagement from './components/ClassManagement';
import StudentManagement from './components/StudentManagement';
import AttendanceAndFees from './components/AttendanceAndFees';
import Reports from './components/Reports';

// --- INLINE SVG ICONS ---
// We define the icons here as React components to avoid external dependencies.
const Icon = ({ children }) => <span className="sidebar__nav-icon">{children}</span>;
const LayoutDashboardIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg></Icon>;
const BookOpenIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></Icon>;
const UsersIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></Icon>;
const CreditCardIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg></Icon>;
const FileTextIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg></Icon>;
const MoonIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg></Icon>;
const SunIcon = () => <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg></Icon>;


// The main App component that holds the state and logic for the entire application.
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [data, setData] = useState({ classes: [], students: [], payments: [], attendance: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  // Effect to apply the theme class to the body
  useEffect(() => {
    document.body.className = ''; // Clear previous theme
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showNotification('Error: Could not fetch data from the server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Centralized API Handler with Optimistic Updates ---

  const handleApiCall = async (endpoint, method, body, successMessage, optimisticUpdate, onSuccess) => {
    const originalData = JSON.parse(JSON.stringify(data)); // Deep copy for reliable rollback
    if (optimisticUpdate) {
      optimisticUpdate(); // Apply UI change immediately for UPDATE/DELETE
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'DELETE' ? JSON.stringify(body) : null,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'An unknown error occurred');
      
      showNotification(successMessage || result.message);
      
      if (onSuccess) {
        onSuccess(result); // Use server response for ADD operations
      }
      
    } catch (error) {
      showNotification(`Error: ${error.message}. Reverting changes.`);
      if (optimisticUpdate) {
        setData(originalData); // Revert UI on failure
      }
    }
  };

  // --- Handler Functions for Child Components ---

  const handleAddStudent = (student) => {
    const onSuccess = (newStudentFromServer) => {
      setData(prev => ({ ...prev, students: [...prev.students, newStudentFromServer] }));
    };
    handleApiCall('students', 'POST', student, 'Student added successfully!', null, onSuccess);
  };
  
  const handleAddClass = (newClass) => {
    const onSuccess = (newClassFromServer) => {
      setData(prev => ({ ...prev, classes: [...prev.classes, newClassFromServer] }));
    };
    handleApiCall('classes', 'POST', newClass, 'Class added successfully!', null, onSuccess);
  };

  const handleUpdateStudent = (student) => handleApiCall(`students/${student.id}`, 'PUT', student, 'Student updated successfully!', () => {
    setData(prev => ({ ...prev, students: prev.students.map(s => s.id === student.id ? student : s) }));
  });

  const handleDropStudent = (studentId) => handleApiCall(`students/${studentId}`, 'DELETE', null, 'Student dropped successfully!', () => {
    setData(prev => ({ ...prev, students: prev.students.filter(s => s.id !== studentId) }));
  });

  const handleUpdateClass = (cls) => handleApiCall(`classes/${cls.id}`, 'PUT', cls, 'Class updated successfully!', () => {
    setData(prev => ({ ...prev, classes: prev.classes.map(c => c.id === cls.id ? cls : c) }));
  });

  const handleDeleteClass = (classId) => handleApiCall(`classes/${classId}`, 'DELETE', null, 'Class deleted successfully!', () => {
    setData(prev => ({ ...prev, classes: prev.classes.filter(c => c.id !== classId) }));
  });

  const handlePaymentUpdate = (payment, newStatus) => {
    const endpoint = 'payments/update';
    const body = { ...payment, status: newStatus };
    const successMessage = 'Payment status updated!';

    const optimisticUpdate = () => {
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
    };

    handleApiCall(endpoint, 'POST', body, successMessage, optimisticUpdate);
  };


  const renderCurrentPage = () => {
    const pageProps = { data, showNotification, onDataUpdate: fetchData };
    switch (currentPage) {
      case 'dashboard': return <Dashboard {...pageProps} onNavigate={setCurrentPage} />;
      case 'classes': return <ClassManagement {...pageProps} onAddClass={handleAddClass} onUpdateClass={handleUpdateClass} onDeleteClass={handleDeleteClass} />;
      case 'students': return <StudentManagement {...pageProps} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onDropStudent={handleDropStudent} />;
      case 'fee-tracking': return <AttendanceAndFees {...pageProps} onPaymentUpdate={handlePaymentUpdate} />;
      case 'reports': return <Reports {...pageProps} />;
      default: return <Dashboard {...pageProps} onNavigate={setCurrentPage} />;
    }
  };

  if (isLoading) return <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;

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
        <div className="sidebar__brand">
          <h1>ClassMaster</h1>
        </div>
        <nav className="sidebar__nav">
          <ul>
            {sidebarPages.map(page => (
              <li key={page.id} className="sidebar__nav-item">
                <a
                  href="#"
                  className={`sidebar__nav-link ${currentPage === page.id ? 'sidebar__nav-link--active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setCurrentPage(page.id); }}
                >
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