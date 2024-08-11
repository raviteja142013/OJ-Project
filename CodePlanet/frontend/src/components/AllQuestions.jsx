import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { backendurl } from '../backendurl.js';
import { AuthContext } from '../providers/authProvider.jsx';
import AdminHeader from './AdminHeader.jsx';
import Modal from './Modal.jsx';

const AllQuestions = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problemData, setProblemData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const authData = useContext(AuthContext);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${backendurl}/admin/getproblems`);
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${backendurl}/admin/problem/${id}`);
      setSelectedProblem(id);
      setProblemData(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching problem:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblemData({ ...problemData, [name]: value });
  };

  const handleArrayChange = (e, index, field, arrayName) => {
    const newArray = Array.isArray(problemData[arrayName])
      ? [...problemData[arrayName]]
      : [];
    
    if (typeof newArray[index] === 'object') {
      newArray[index] = { ...newArray[index], [field]: e.target.value };
    } else {
      newArray[index] = e.target.value;
    }

    setProblemData({ ...problemData, [arrayName]: newArray });
  };

  const handleAddSampleTestCase = () => {
    setProblemData({
      ...problemData,
      sampleTestCases: [
        ...problemData.sampleTestCases,
        { input: '', output: '', explanation: '' },
      ],
    });
  };

  const handleAddTag = (arrayName) => {
    setProblemData({
      ...problemData,
      [arrayName]: [...problemData[arrayName], ''],
    });
  };

  const handleRemoveTag = (index, arrayName) => {
    const newArray = [...problemData[arrayName]];
    newArray.splice(index, 1);
    setProblemData({ ...problemData, [arrayName]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`${backendurl}/admin/updateproblem/${selectedProblem}`, {
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        constraints: problemData.constraints,
        inputFormat: problemData.inputFormat,
        outputFormat: problemData.outputFormat,
        sampleTestCases: problemData.sampleTestCases,
        topicTags: problemData.topicTags,
        companyTags: problemData.companyTags,
        // You can remove the inputFile and outputFile fields if you want to keep them unchanged
      });
    
      if (response.status === 200) {
        const updatedProblems = problems.map(problem =>
          problem._id === selectedProblem ? response.data : problem
        );
        setProblems(updatedProblems);
        setProblemData(null);
        setSelectedProblem(null);
        setModalOpen(false); // Ensure modal is closed here
      } else {
        console.error('Failed to update problem:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating problem:', error.message);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendurl}/admin/problem/${id}`);
  
      if (response.status === 200) {
        setProblems(problems.filter(problem => problem._id !== id));
      } else {
        console.error('Failed to delete problem:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting problem:', error.message);
    }
  };
  
  
  
  return (
    <>
      <div className="flex">
        <AdminHeader className="flex-shrink-0 w-64" />
        <div className="flex-grow p-4 mt-10">
        
            <h1 className="text-4xl font-bold mb-8">All Questions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {problems.map((problem) => (
                <div
                  key={problem._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2">{problem.title}</h2>
                    <p className="text-gray-600 mb-4">ID: <strong>{problem._id}</strong></p>
                    <div className="items-center mb-4">
                      <p className="mr-2">
                        Topic Tags:
                        <strong className="text-blue-500"> {problem.topicTags.join(", ")}</strong>
                      </p>
                      <p>
                        Company Tags:
                        <strong className="text-green-500"> {problem.companyTags.join(", ")}</strong>
                      </p>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        onClick={() => handleEdit(problem._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                        onClick={() => handleDelete(problem._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

    
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedProblem && problemData && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Edit Problem</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white p-6 rounded shadow-md border border-gray-300">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={problemData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={problemData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Difficulty</label>
                <input
                  type="text"
                  name="difficulty"
                  value={problemData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Constraints</label>
                <input
                  type="text"
                  name="constraints"
                  value={problemData.constraints}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Input Format</label>
                <input
                  type="text"
                  name="inputFormat"
                  value={problemData.inputFormat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Output Format</label>
                <input
                  type="text"
                  name="outputFormat"
                  value={problemData.outputFormat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Sample Test Cases */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Sample Test Cases</label>
                {problemData.sampleTestCases.map((testCase, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex">
                      <div className="w-1/3 pr-2">
                        <label className="block text-gray-700 font-bold mb-2">Input</label>
                        <input
                          type="text"
                          value={testCase.input}
                          onChange={(e) => handleArrayChange(e, index, 'input', 'sampleTestCases')}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div className="w-1/3 px-2">
                        <label className="block text-gray-700 font-bold mb-2">Output</label>
                        <input
                          type="text"
                          value={testCase.output}
                          onChange={(e) => handleArrayChange(e, index, 'output', 'sampleTestCases')}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div className="w-1/3 pl-2">
                        <label className="block text-gray-700 font-bold mb-2">Explanation</label>
                        <input
                          type="text"
                          value={testCase.explanation}
                          onChange={(e) => handleArrayChange(e, index, 'explanation', 'sampleTestCases')}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index, 'sampleTestCases')}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Test Case
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSampleTestCase}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Test Case
                </button>
              </div>

              {/* Topic Tags */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Topic Tags</label>
                {problemData.topicTags.map((tag, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange(e, index, '', 'topicTags')}
                      className="w-full px-3 py-2 border rounded"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index, 'topicTags')}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Remove Tag
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddTag('topicTags')}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Tag
                </button>
              </div>

              {/* Company Tags */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Company Tags</label>
                {problemData.companyTags.map((tag, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange(e, index, '', 'companyTags')}
                      className="w-full px-3 py-2 border rounded"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index, 'companyTags')}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Remove Tag
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddTag('companyTags')}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Tag
                </button>
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Update Problem
              </button>
            </form>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AllQuestions;
