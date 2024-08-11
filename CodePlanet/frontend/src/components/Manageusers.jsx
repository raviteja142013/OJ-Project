import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendurl } from "../backendurl";
import AdminHeader from "./AdminHeader";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usersPerPage] = useState(7);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${backendurl}/admin/users?page=${currentPage}&limit=${usersPerPage}`
      );
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error("Failed to fetch users:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleClickNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + usersPerPage, users.length - 1)
    );
  };

  const handleClickPrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - usersPerPage, 0));
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditName(user.username);
    setEditContact(user.contact);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`${backendurl}/admin/users/${userId}`);
      if (response.data.success) {
        fetchUsers(); // Refresh the list of users
      } else {
        console.error("Failed to delete user:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${backendurl}/admin/users/${editUser._id}`, {
        username: editName,
        contact: editContact,
      });
      if (response.data.success) {
        setEditUser(null);
        fetchUsers(); // Refresh the list of users
      } else {
        console.error("Failed to update user:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const totalUsers = users.length; // Assuming you get total users from backend
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar/Navbar */}
      <AdminHeader />
      <div className="container mx-auto flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Users</h1>

        <div className="overflow-hidden border border-gray-300 shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider border-r border-gray-300">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider border-r border-gray-300">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider border-r border-gray-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider border-r border-gray-300">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {users.slice(currentIndex, currentIndex + usersPerPage).map((user, index) => (
                <tr key={user._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">{currentIndex + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">{user.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-gray-200 px-4 py-3 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={handleClickPrev}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={handleClickNext}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing
                  <span className="font-medium mx-1">{currentIndex + 1}</span>
                  to
                  <span className="font-medium mx-1">{currentIndex + usersPerPage}</span>
                  of
                  <span className="font-medium mx-1">{totalUsers}</span>
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handleClickPrev}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleClickNext}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contact Number
              </label>
              <input
                type="text"
                value={editContact}
                onChange={(e) => setEditContact(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Update
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
