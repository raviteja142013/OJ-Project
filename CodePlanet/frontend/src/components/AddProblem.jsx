import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../providers/authProvider";
import { backendurl } from "../backendurl.js";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader.jsx";
import Cookies from 'js-cookie';

const AddProblem = () => {
  const [problemData, setProblemData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    constraints: "",
    inputFormat: "",
    outputFormat: "",
    sampleTestCases: [{ input: "", output: "", explanation: "" }],
    topicTags: [""],
    companyTags: [""],
    inputFile: null,
    outputFile: null,
  });
  const navigate = useNavigate();
  const authData = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblemData({ ...problemData, [name]: value });
  };

  const handleArrayChange = (e, index, field, arrayName) => {
    const newArray = [...problemData[arrayName]];
    if (arrayName === "sampleTestCases") {
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
        { input: "", output: "", explanation: "" },
      ],
    });
  };

  const handleAddTag = (arrayName) => {
    setProblemData({
      ...problemData,
      [arrayName]: [...problemData[arrayName], ""],
    });
  };

  const handleRemoveTag = (index, arrayName) => {
    const newArray = [...problemData[arrayName]];
    newArray.splice(index, 1);
    setProblemData({ ...problemData, [arrayName]: newArray });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProblemData({ ...problemData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userdetail = Cookies.get('user');
     const user = JSON.parse(userdetail); 
    let userid = user._id;
    
    const problemDataToSend = {
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        constraints: problemData.constraints,
        inputFormat: problemData.inputFormat,
        outputFormat: problemData.outputFormat,
        sampleTestCases: problemData.sampleTestCases,
        topicTags: problemData.topicTags,
        companyTags: problemData.companyTags,
        userid: userid,
    };

    try {
        const response = await axios.post(`${backendurl}/problem/addproblem`, problemDataToSend, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 201) {
            setProblemData({
                title: "",
                description: "",
                difficulty: "easy",
                constraints: "",
                inputFormat: "",
                outputFormat: "",
                sampleTestCases: [{ input: "", output: "", explanation: "" }],
                topicTags: [""],
                companyTags: [""],
            });
            navigate("/admin");
        }
    } catch (error) {
        console.error("Error adding problem:", error);
    }
};

  return (
    <>
      <div className="flex">
        <AdminHeader className="flex-shrink-0 w-64" />
        <div className="flex-grow p-4">
          <div className="container mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-black">Add a New Problem</h1>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="bg-white p-6 rounded shadow-md border border-black-300"
            >
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={problemData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={problemData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-black-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={problemData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black-300 rounded"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Constraints</label>
                <textarea
                  name="constraints"
                  value={problemData.constraints}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-black-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Input Format</label>
                <textarea
                  name="inputFormat"
                  value={problemData.inputFormat}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-black-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Output Format</label>
                <textarea
                  name="outputFormat"
                  value={problemData.outputFormat}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-black-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Sample Test Cases</label>
                {problemData.sampleTestCases.map((testCase, index) => (
                  <div key={index} className="mb-4 bg-gray-100 p-4 rounded border border-gray-300">
                    <textarea
                      placeholder="Input"
                      value={testCase.input}
                      onChange={(e) =>
                        handleArrayChange(e, index, "input", "sampleTestCases")
                      }
                      className="w-full px-3 py-2 border border-black-300 rounded mb-2"
                      required
                    />
                    <textarea
                      placeholder="Output"
                      value={testCase.output}
                      onChange={(e) =>
                        handleArrayChange(e, index, "output", "sampleTestCases")
                      }
                      className="w-full px-3 py-2 border border-black-300 rounded mb-2"
                      required
                    />
                    <textarea
                      placeholder="Explanation"
                      value={testCase.explanation}
                      onChange={(e) =>
                        handleArrayChange(e, index, "explanation", "sampleTestCases")
                      }
                      className="w-full px-3 py-2 border border-black-300 rounded mb-2"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSampleTestCase}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Add Another Test Case
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Topic Tags</label>
                {problemData.topicTags.map((tag, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) =>
                        handleArrayChange(e, index, "tag", "topicTags")
                      }
                      className="w-full px-3 py-2 border border-black-300 rounded"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index, "topicTags")}
                      className="ml-2 px-3 py-2 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddTag("topicTags")}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Add Another Tag
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Company Tags</label>
                {problemData.companyTags.map((tag, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) =>
                        handleArrayChange(e, index, "tag", "companyTags")
                      }
                      className="w-full px-3 py-2 border border-black-300 rounded"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index, "companyTags")}
                      className="ml-2 px-3 py-2 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddTag("companyTags")}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Add Another Tag
                </button>
              </div>
             
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProblem;