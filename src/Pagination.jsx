import './Pagination.css';
import backSvg from './assets/back.svg';
import forwardSvg from './assets/forward.svg';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const getPageNumbers = () => {
    let pages = [];
    
    pages.push(1);
    
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    if (rangeStart > 2) {
      pages.push('...');
    }
    
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="pagination">
      <button 
        className="pagination-btn prev-btn" 
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <img src={backSvg} alt="Previous" className="pagination-icon" />
        Previous
      </button>
      
      <div className="page-numbers">
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="ellipsis">...</span>
          ) : (
            <button
              key={page}
              className={`page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      <button 
        className="pagination-btn next-btn" 
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
        <img src={forwardSvg} alt="Next" className="pagination-icon" />
      </button>
    </div>
  );
}

export default Pagination;
