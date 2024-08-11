import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../providers/authProvider";
import Header from "./Header";
import Cookies from 'js-cookie';
import { backendurl } from "../backendurl";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    contact: "",
  });
  const [questionsSolved, setQuestionsSolved] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [submissions, setSubmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 10;

  const authData = useContext(AuthContext);
  // const cd = response.data.user;
  // comsole.log(cd);
  // const { checkAuth, auth } = useContext(AuthContext);
  // console.log(auth);
  // authData();
  const [auth, setAuth] = useState('');
  // const [name, setName] = useState(' ');
  useEffect(() => {
    const token = Cookies.get('token');
    const userdetail = Cookies.get('user');
    const role = Cookies.get('role')
    console.log(role);
    console.log(userdetail);
    // console.log(userdetail._id);//only after parse, you can access
    
    if (token && userdetail && role) {
      const user = JSON.parse(userdetail);
      console.log(user);
      console.log(user._id);
      setUser({user: user._id });
      console.log(user);
      // const funct = (token, user, role) => {
      //   setAuth({ loggedIn: true, token:token,user:user,  role:role });
      //   axios.defaults.headers.common['Authorization'] = token;
      //   console.log(auth);
      //   console.log(auth.user);
      // }; 
      console.log("ho profile");
      // funct();

    }
    const fetchUserData = async () => {
      try {
        
        const user  = JSON.parse(userdetail);
        console.log(user);
        const userid = user._id;
        console.log(userid);
        const response = await axios.get(`${backendurl}/user/${userid}`);
        const userData = response.data;
        setUser(userData);
        setEditFormData({
          username: userData.username,
          email: userData.email,
          contact: userData.contact,
        });
        const response2 = await axios.get(
          `${backendurl}/user/submissions/${userid}`
        );
        const submissionsData = response2.data;
        setSubmissions(submissionsData.submissions);
        setQuestionsSolved(submissionsData.questionsSolved);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);
  //   const checkAuth = async () => {
  //     try {
  //         const response = await axios.get(`${backendurl}/auth`, { withCredentials: true });
  //         setAuth({ loggedIn: true, token: response.data.token,user:response.data.user,  role: response.data.role });
  //         localStorage.setItem("token", response.data.token);
  //         localStorage.setItem("user", response.data.user);
  //         localStorage.setItem("role", response.data.role);
  //     } catch (err) {
  //         setAuth(null);
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("user");
  //         localStorage.removeItem("role");
  //     }
  // };


  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userdetail = Cookies.get('user');
      console.log(userdetail);
      const user  = JSON.parse(userdetail);
      const userid = user._id;
      const updatedUserData = {
        username: editFormData.username,
        email: editFormData.email,
        contact: editFormData.contact,
      };
      const response = await axios.put(
        `${backendurl}/user/edit/${userid}`,
        updatedUserData
      );
      setUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const openModal = (code) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCode("");
  };

  // Calculate the indices for pagination
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = submissions.slice(
    indexOfFirstSubmission,
    indexOfLastSubmission
  );

  // Pagination handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {user ? (
          <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl text-center font-bold text-gray-800 mt-5 mb-8">
              Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    User Details
                  </h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 focus:outline-none"
                  >
                    {editing ? "Cancel" : "Edit"}
                  </button>
                </div>
                {editing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="contact"
                      >
                        Contact Number
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="contact"
                        type="text"
                        placeholder="Contact Number"
                        name="contact"
                        value={editFormData.contact}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 focus:outline-none mr-4"
                        type="submit"
                      >
                        Save
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none"
                        type="button"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-gray-700 mb-2">
                      <strong>Username:</strong> {user.username}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Contact Number:</strong> {user.contact}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {user.email}
                    </p>
                  </>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Questions Solved
                </h4>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">Easy</p>
                    <p className="text-4xl font-bold text-gray-900 mt-1">
                      {questionsSolved.easy}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">Medium</p>
                    <p className="text-4xl font-bold text-gray-900 mt-1">
                      {questionsSolved.medium}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">Hard</p>
                    <p className="text-4xl font-bold text-gray-900 mt-1">
                      {questionsSolved.hard}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Submissions History
              </h3>
              <table className="min-w-full bg-white mb-4">
                <thead>
                  <tr>
                    <th className="w-1/5 py-2">Date</th>
                    <th className="w-1/5 py-2">Title</th>
                    <th className="w-1/5 py-2">Language</th>
                    <th className="w-1/5 py-2">Status</th>
                    <th className="w-1/5 py-2">View Code</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSubmissions.map((submission, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2">
                        {new Date(submission.date).toLocaleDateString()}
                      </td>
                      <td className="py-2">{submission.problem}</td>
                      <td className="py-2">{submission.language}</td>
                      <td className="py-2">
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${submission.verdict === "Pass"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {submission.verdict}
                        </span>
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => openModal(submission.code)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center">
                <nav>
                  <ul className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li key={index + 1}>
                        <button
                          onClick={() => paginate(index + 1)}
                          className={`px-4 py-2 rounded-lg ${currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Code
                  </h2>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                    <code>{selectedCode}</code>
                  </pre>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 focus:outline-none"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </>
  );
};

export default Profile;