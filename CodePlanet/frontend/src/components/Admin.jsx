import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import { backendurl } from '../backendurl';

const AdminPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    problems: 0,
    submissions: 0,
  });
  const [topUsers, setTopUsers] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [activeTable, setActiveTable] = useState('topUsers');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${backendurl}/admin/stats`);
        setStats({
          users: response.data.users,
          problems: response.data.problems,
          submissions: response.data.submissions,
        });
      } catch (error) {
        console.error('Error fetching stats', error);
      }
    };

    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(`${backendurl}/admin/topusers`);
        setTopUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching top users', error);
      }
    };

    const fetchRecentSubmissions = async () => {
      try {
        const response = await axios.get(`${backendurl}/admin/getsubmissions`);
        const recentSubmissions = response.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setRecentSubmissions(recentSubmissions);
      } catch (error) {
        console.error('Error fetching recent submissions', error);
      }
    };

    fetchStats();
    fetchTopUsers();
    fetchRecentSubmissions();
  }, []);

  return (
    <div className="flex bg-gray-100 h-screen">
      <AdminHeader />
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <CompactCard title="Users" count={stats.users} icon="fa-users" />
          <CompactCard title="Problems" count={stats.problems} icon="fa-tasks" />
          <CompactCard title="Submissions" count={stats.submissions} icon="fa-file-alt" />
        </div>
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <div className="flex mb-4">
            <button
              className={`mr-4 px-4 py-2 rounded-md transition ${
                activeTable === 'topUsers'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-blue-500 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTable('topUsers')}
            >
              Top Users
            </button>
            <button
              className={`px-4 py-2 rounded-md transition ${
                activeTable === 'recentSubmissions'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-blue-500 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTable('recentSubmissions')}
            >
              Recent Submissions
            </button>
          </div>
          {activeTable === 'topUsers' && (
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-100 border-b text-left">Username</th>
                  <th className="py-3 px-4 bg-gray-100 border-b text-left">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{user.username}</td>
                    <td className="py-3 px-4 border-b">{user.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTable === 'recentSubmissions' && (
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-100 border-b text-left">Username</th>
                  <th className="py-3 px-4 bg-gray-100 border-b text-left">Problem</th>
                  <th className="py-3 px-4 bg-gray-100 border-b text-left">Difficulty</th>
                  <th className="py-3 px-4 bg-gray-100 border-b text-left">Submission Time</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{submission.userid.username}</td>
                    <td className="py-3 px-4 border-b">{submission.problemid.title}</td>
                    <td className="py-3 px-4 border-b">{submission.problemid.difficulty}</td>
                    <td className="py-3 px-4 border-b">{new Date(submission.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const CompactCard = ({ title, count, icon }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
    <div>
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-2xl font-bold">{count}</p>
    </div>
    <div className="text-blue-500">
      <i className={`fas ${icon} fa-3x`}></i>
    </div>
  </div>
);

export default AdminPage;
