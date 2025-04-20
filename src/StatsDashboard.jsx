import './StatsDashboard.css';

function StatsDashboard({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-dashboard card">
      <h2 className="section-title">Dashboard</h2>

      <div className="stats-overview">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{stats.upcomingDue}</div>
          <div className="stat-label">Due Soon</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{stats.completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      {Object.keys(stats.subjectStats).length > 0 && (
        <div className="subject-stats">
          <h3 className="subject-stats-title">By Subject</h3>
          <div className="subject-stats-grid">
            {Object.entries(stats.subjectStats).map(([subject, data]) => {
              const percent = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
              const widthClassValue = Math.round(percent / 10) * 10; 
              const widthClassName = `width-${widthClassValue}`; 

              return (
                <div key={subject} className="subject-stat-item">
                  <div className="subject-name">{subject}</div>
                  <div className="subject-progress">
                    <div
                      className={`subject-progress-bar ${widthClassName}`} 
                    ></div>
                  </div>
                  <div className="subject-details">
                    {data.completed}/{data.total} ({percent}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsDashboard;
