import React, { useState } from 'react';

// Updated component for downloading reports with the new theme.
const Reports = ({ data, showNotification = (msg) => console.log('Notification:', msg) }) => {
  const [feeMonth, setFeeMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isDownloading, setIsDownloading] = useState(false);

  // Handles the download of the Fee Report CSV file.
  const handleFeeReportDownload = async () => {
    setIsDownloading(true);
    showNotification('Preparing your report...');

    try {
      const response = await fetch(`http://localhost:5000/api/reports/fees?month=${feeMonth}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fee_report_${feeMonth}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download failed:", error);
      showNotification(`Error: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>Generate and download monthly fee reports.</p>
      </div>

      <div className="dashboard-card" style={{maxWidth: '700px'}}>
        <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '32px'}}>Fee Report</h3>
        <p style={{color: 'var(--c-text-secondary)', marginTop: 0, marginBottom: '32px'}}>
          Download a summary of all fee payments for a selected month in CSV format.
        </p>
         <div className="form-group" >
          <label className="form-label">Select Month</label>
          <input
            type="month"
            className="form-control"
            value={feeMonth}
            onChange={(e) => setFeeMonth(e.target.value)}
          />
        </div>
        <p style={{color: 'var(--c-text-secondary)', marginTop: 0, marginBottom: '32px'}}>
          
        </p>
        <button
          className="btn btn--primary"
          style={{width: '100%'}}
          onClick={handleFeeReportDownload}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download Fee Report'}
        </button>
      </div>
    </div>
  );
};

export default Reports;