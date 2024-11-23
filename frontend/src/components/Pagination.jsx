import React from 'react';

const Pagination = ({ currentPage, totalPages, handleNextPage, handlePrevPage }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={handlePrevPage}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="text-sm self-center">{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        onClick={handleNextPage}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
