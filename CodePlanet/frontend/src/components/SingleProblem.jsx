import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
import Header from "./Header";
import { backendurl } from "../backendurl";
import { toast } from "sonner";
import SubmissionModal from "./SubmissionModal";

const SingleProblem = () => {
  const [language, setLanguage] = useState("python");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState({
    python: `print("Hello, World!")`,
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  });
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [submittedOutput, setSubmittedOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [viewMode, setViewMode] = useState("problem");
  const [selectedSubmission, setSelectedSubmission] = useState(null); // State for selected submission
  const [editorTheme, setEditorTheme] = useState("vs-dark"); // State for editor theme
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const authData = useContext(AuthContext);
  const isloggedin = authData.authData ? true : false;

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const toggleEditorTheme = () => {
    setEditorTheme((prevTheme) =>
      prevTheme === "vs-dark" ? "vs-light" : "vs-dark"
    );
  };

  const runCode = () => {
    setLoading(true);
    axios
      .post(`${backendurl}/problem/runproblem`, {
        code: code[language],
        language,
        input,
      })
      .then((res) => {
        if (res.data.output !== "") {
          setOutput(res.data.output);
          setError("");
        }
        if (res.data.error !== "") {
          setError(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/problem/getproblem/${id}`
        );
        setProblem(response.data.question);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
    if (isloggedin) {
      fetchUserSubmissions();
    }
  }, [id, isloggedin]);

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const openSubmissionModal = (submission) => {
    setSelectedSubmission(submission);
  };

  const closeSubmissionModal = () => {
    setSelectedSubmission(null);
  };

  const onSubmit = () => {
    if (!code[language]) {
      setError("Code cannot be empty");
      return;
    }
    setSubmitted(true);
    const userId = authData.authData?.user._id;
    axios
      .post(`${backendurl}/problem/submit`, {
        problemid: id,
        userId,
        code: code[language],
        language,
      })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
          setError(res.data.error);
        } else {
          console.log(res.data);
          const results = res.data.results;
          setTestCaseResults(results);
          const verdict = results.every((result) => result.verdict === "Pass")
            ? "Pass"
            : "Fail";
  
          if (verdict === "Fail") {
            const failedTestCase = results.find((result) => result.verdict === "Fail");
            const failedIndex = results.indexOf(failedTestCase) + 1;
            toast.error(`Failed in Test Case ${failedIndex}`);
          } else {
            toast.success("All test cases passed");
          }
          
          setSubmittedOutput(verdict);
          setIsModalOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSubmitted(false);
        fetchUserSubmissions(); // Refresh user submissions after submission
      });
  };
  
  const fetchUserSubmissions = async () => {
    const userId = authData.authData?.user._id;
    try {
      const response = await axios.get(
        `${backendurl}/problem/usersubmissions/${id}/${userId}`
      );
      setUserSubmissions(response.data.submissions);
    } catch (error) {
      console.error("Error fetching user submissions:", error);
    }
  };

  return (
    <>
      <Header />
      {isloggedin && problem ? (
        <div className="flex flex-col min-h-screen bg-gray-100">
          <div className="container mx-auto mt-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mt-5">
                    {problem.title}
                  </h2>
                  <span
                    className={`px-2 py-1 font-bold text-lg rounded ${
                      problem.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : problem.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : problem.difficulty === "hard"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={() => toggleViewMode("problem")}
                      className={`px-4 py-2 rounded-lg ${
                        viewMode === "problem"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-800"
                      }`}
                    >
                      Problem
                    </button>
                    <button
                      onClick={() => toggleViewMode("submissions")}
                      className={`px-4 py-2 rounded-lg ${
                        viewMode === "submissions"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-800"
                      }`}
                    >
                      Submissions
                    </button>
                  </div>


                  {viewMode === "problem" && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Description
                      </h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: problem.description }}
                      ></div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Constraints
                      </h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: problem.constraints }}
                      ></div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Input Format
                      </h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: problem.inputFormat }}
                      ></div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Output Format
                      </h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: problem.outputFormat }}
                      ></div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Sample Test Cases
                      </h3>
                      {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                          <p className="text-gray-600 mb-2">
                            <strong>Input:</strong>
                          </p>
                          <p className="text-gray-600 mb-2">
                            {problem.sampleTestCases[0].input
                              .split("\n")
                              .map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))}
                          </p>
                          <p className="text-gray-600">
                            <strong>Output:</strong>
                          </p>
                          <p className="text-gray-600 mb-2">
                            {problem.sampleTestCases[0].output
                              .split("\n")
                              .map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {viewMode === "submissions" && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Your Submissions
                      </h3>
                      {userSubmissions.length > 0 ? (
                        userSubmissions.map((submission) => (
                          <div
                            key={submission._id}
                            className="bg-gray-700 p-4 rounded-lg mb-4"
                          >
                            <p className="text-gray-300 mb-2">
                              <strong>Date:</strong>{" "}
                              {new Date(submission.createdAt).toLocaleString()}
                            </p>
                            <p className="text-gray-300 mb-2">
                              <strong>Language:</strong> {submission.language}
                            </p>
                            <p className="text-gray-300 mb-2">
                              <strong>Verdict:</strong>{" "}
                              <span
                                className={`font-semibold ${
                                  submission.verdict === "Pass"
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {submission.verdict}
                              </span>
                            </p>
                            <button
                              onClick={() => openSubmissionModal(submission)} // Open modal on button click
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 mt-2"
                            >
                              View Code
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-300">No submissions yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md mt-3">
                  <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Editor</h2>
                  <select
                      value={language}
                      onChange={handleLanguageChange}
                      className="px-4 py-2 border rounded-md"
                    >
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                      <button
                        onClick={toggleEditorTheme}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                      >
                        {editorTheme === "vs-dark" ? "Light Mode" : "Dark Mode"}
                      </button>          
                  </div>
                  <div className="editor-container">
                  <Editor
                    height="50vh"
                    theme={editorTheme}
                    language={language}
                    value={code[language]}
                    onChange={(value) =>
                      setCode((prevCode) => ({
                        ...prevCode,
                        [language]: value,
                      }))
                    }
                    options={{ fontSize: 16 }}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={runCode}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
                  >
                    Run
                  </button>
                  <button
                    onClick={onSubmit}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
                  >
                    Submit
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-w mbblack2">
                    Input
                  </h3>
                  <textarea
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    className="w-full h-20 bg-gray-700 text-white p-4 rounded-lg focus:outline-none"
                    placeholder="Input for your code..."
                  ></textarea>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Output
                  </h3>
                  {loading ? (
                    <div className="text-white text-center mt-4">
                      <ClipLoader color="#FFFFFF" size={35} />
                    </div>
                  ) : (
                    <textarea
                      value={output}
                      className="w-full h-20 bg-gray-700 text-white p-4 rounded-lg focus:outline-none"
                      placeholder="Output from your code..."
                    ></textarea>
                  )}
                </div>

                {error && (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Error
                    </h3>
                    <div className="text-red-500 bg-gray-700 p-4 rounded-lg ">
                      {error}
                    </div>
                  </>
                )}

                {submitted ? (
                  <div className="text-white text-center mt-4">
                    <ClipLoader color="#FFFFFF" size={60} />
                  </div>
                ) : (
                  submittedOutput && (
                    <>
                      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h4 className="text-md font-semibold text-black mb-2">Test Case Results</h4>
            {testCaseResults.map((result, index) => (
              <div key={index} className="mb-4">
                <div
                  className={`p-2 rounded ${
                    result.verdict === "Pass"
                      ? "text-green-500 bg-black-200"
                      : "text-red-500 bg-black"
                  }`}
                >
                  Test Case {index + 1}: {result.verdict}
                </div>
                {result.verdict === "Fail" && (
                  <div className="text-black bg-gray-200 mt-2">
                    <div><b>Input:</b> {result.input}</div>
                    <div><b>Expected Output:</b> {result.expectedOutput}  <b>Actual Output:</b> {result.actualOutput}</div>
                  </div>
                )}
              </div>
            ))}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
       {testCaseResults.length > 0 && (
      <div className="mt-4">
        <h4 className="text-md font-semibold text-black mb-2">Test Case Results</h4>
        {testCaseResults.map((result, index) => (
          <div key={index} className="mb-2">
            <div
              className={`p-2 rounded ${
                result.verdict === "Pass"
                  ? "text-green-500 bg-gray-800"
                  : "text-red-500 bg-gray-800"
              }`}
            >
              Test Case {index + 1}: {result.verdict}
            </div>
          </div>
        ))}
      </div>
    )}
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Result
                      </h3>
                      <div
                        className={`p-4 rounded-lg ${
                          submittedOutput === "Pass"
                            ? "text-green-500 bg-gray-700"
                            : "text-red-500 bg-gray-700"
                        }`}
                      >
                        {submittedOutput}
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4">
          <ClipLoader color="#1f2937" size={60} />
        </div>
      )}
      {selectedSubmission && (
        <SubmissionModal
          isOpen={selectedSubmission !== null}
          closeModal={closeSubmissionModal}
          submission={selectedSubmission}
        />
      )}
    </>
  );
};

export default SingleProblem;
