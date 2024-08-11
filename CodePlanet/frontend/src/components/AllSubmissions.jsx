import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { backendurl } from "../backendurl";
import AdminHeader from "./AdminHeader";

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionsPerPage] = useState(10);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${backendurl}/admin/getsubmissions`);
      setSubmissions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showCodeModal = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const CodeModal = () => (
    
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
        >
          <div className="bg-white rounded-lg p-6 w-3/4 md:w-1/2 lg:w-1/3 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowModal(false)}
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
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto border border-gray-300">
              <code className="text-sm text-gray-800">{selectedSubmission.code}</code>
            </pre>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      
    
    
  );
  
  
  

  const totalSubmissions = submissions.length;
  const totalPages = Math.ceil(totalSubmissions / submissionsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex bg-gray-100 h-screen">
      <AdminHeader />

      <main className="flex-1 container mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg mt-4 mb-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader color="#007BFF" size={50} />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">All Submissions</h1>

            <div className="overflow-x-auto border border-gray-300 shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-200 text-red-500">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider border-r border-gray-300">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider border-r border-gray-300">User Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider border-r border-gray-300">Problem Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider border-r border-gray-300">Created At</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {submissions
                    .slice((currentPage - 1) * submissionsPerPage, currentPage * submissionsPerPage)
                    .map((submission) => (
                      <tr key={submission._id} className="bg-white odd:bg-gray-100">
                        <td className="px-4 py-2 text-sm whitespace-nowrap border-r border-gray-300">{submission._id}</td>
                        <td className="px-4 py-2 text-sm whitespace-nowrap border-r border-gray-300">{submission.userid.username}</td>
                        <td className="px-4 py-2 text-sm whitespace-nowrap border-r border-gray-300">{submission.problemid.title}</td>
                        <td className="px-4 py-2 text-sm whitespace-nowrap border-r border-gray-300">{new Date(submission.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm whitespace-nowrap">
                          <button
                            onClick={() => showCodeModal(submission)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                          >
                            View Code
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between bg-gray-200 px-4 py-3 sm:px-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 ${
                      currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-white border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {showModal && <CodeModal />}
    </div>
  );
};

export default AllSubmissions;
