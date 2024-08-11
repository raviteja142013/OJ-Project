import React from "react";

const SubmissionModal = ({ isOpen, closeModal, submission }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-1/2">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={closeModal}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Submission Code</h2>
        <pre className="bg-gray-200 p-4 rounded-lg overflow-auto">
          <code className="text-sm">{submission.code}</code>
        </pre>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
