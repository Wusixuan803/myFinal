import { useState } from 'react';
import './FilterControls.css';
import { ASSIGNMENT_STATUS } from './constants';
import downSvg from './assets/down.svg';

function FilterControls({ filter, sort, subjects, onFilterChange, onSortChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleStatusChange = (status) => {
    onFilterChange({ ...filter, status });
  };
  
  const handleSubjectChange = (e) => {
    onFilterChange({ ...filter, subject: e.target.value });
  };
  
  const handleSearchChange = (e) => {
    onFilterChange({ ...filter, search: e.target.value });
  };
  
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };
  
  return (
    <div className="filter-controls card">
      <div className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="section-title">Filters & Sorting</h2>
        <img 
          src={downSvg} 
          alt={isExpanded ? "Collapse" : "Expand"} 
          className={`filter-toggle ${isExpanded ? 'expanded' : ''}`} 
        />
      </div>
      
      {isExpanded && (
        <div className="filter-content">
          <div className="filter-row">
            <div className="filter-group">
              <label>Status:</label>
              <div className="status-filters">
                <button 
                  className={`status-filter ${filter.status === ASSIGNMENT_STATUS.ALL ? 'active' : ''}`}
                  onClick={() => handleStatusChange(ASSIGNMENT_STATUS.ALL)}
                >
                  All
                </button>
                <button 
                  className={`status-filter ${filter.status === ASSIGNMENT_STATUS.PENDING ? 'active' : ''}`}
                  onClick={() => handleStatusChange(ASSIGNMENT_STATUS.PENDING)}
                >
                  Pending
                </button>
                <button 
                  className={`status-filter ${filter.status === ASSIGNMENT_STATUS.COMPLETED ? 'active' : ''}`}
                  onClick={() => handleStatusChange(ASSIGNMENT_STATUS.COMPLETED)}
                >
                  Completed
                </button>
              </div>
            </div>
            
            <div className="filter-group">
              <label htmlFor="subject-filter">Subject:</label>
              <select 
                id="subject-filter" 
                className="form-control"
                value={filter.subject}
                onChange={handleSubjectChange}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort-by">Sort By:</label>
              <select 
                id="sort-by" 
                className="form-control"
                value={sort}
                onChange={handleSortChange}
              >
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="subject">Subject</option>
              </select>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group search-group">
              <label htmlFor="search-filter">Search:</label>
              <input
                type="text"
                id="search-filter"
                className="form-control"
                placeholder="Search assignments..."
                value={filter.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterControls;
