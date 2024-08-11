import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import Header from "./Header";
import { backendurl } from "../backendurl";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");

  const authData = useContext(AuthContext);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${backendurl}/problem/getproblems`);
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, [authData]);

  const filterProblems = (problems) => {
    if (!Array.isArray(problems)) return [];
    return problems.filter((problem) => {
      const difficultyMatch = difficultyFilter
        ? problem.difficulty === difficultyFilter
        : true;
      const keywordMatch = keywordFilter
        ? problem.title.toLowerCase().includes(keywordFilter.toLowerCase())
        : true;
      const companyMatch = companySearch
        ? problem.companyTags.some((company) =>
            company.toLowerCase().includes(companySearch.toLowerCase())
          )
        : true;
      const topicMatch = topicSearch
        ? problem.topicTags.some((topic) =>
            topic.toLowerCase().includes(topicSearch.toLowerCase())
          )
        : true;
      return difficultyMatch && keywordMatch && companyMatch && topicMatch;
    });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* <h2 className="text-3xl font-bold text-gray-900 mb-10 mt-12 text-center">Explore Problems</h2> */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between mt-12 mb-8 items-center space-y-4 sm:space-y-0">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="p-2 bg-gray-200 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              type="text"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              placeholder="Search by keyword"
              className="p-2 bg-gray-200 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              placeholder="Search by company"
              className="p-2 bg-gray-200 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              placeholder="Search by topic"
              className="p-2 bg-gray-200 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Tags</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic Tags</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterProblems(problems).map((problem) => (
                <tr key={problem._id} className="hover:bg-gray-100">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{problem.title}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        problem.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : problem.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.companyTags.slice(0, 3).map((company, index) => (
                      <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-1 mb-1 inline-block">
                        {company}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.topicTags.slice(0, 3).map((topic, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-1 mb-1 inline-block">
                        {topic}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{problem.submissionsCount}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/problem/${problem._id}`}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
                    >
                      Solve Now 
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Problems;
