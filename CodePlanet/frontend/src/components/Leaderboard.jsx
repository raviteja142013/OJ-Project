import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { backendurl } from '../backendurl';
const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);
  

  useEffect(() => {
    

    const fetchTopUsers = async () => {
      try {
   
        const response = await axios.get(`${backendurl}/admin/topusers`);
        setTopUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching top users', error);
      }
    };
    fetchTopUsers();
  }, []);




  return (
    <>
    <Header />
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
    
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-20">Leaderboard</h1>
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {topUsers.map((stats, index) => (
            <tr key={stats.userId}>
              <td className="py-4 px-6 text-sm font-medium text-gray-900">{index + 1}</td>
              <td className="py-4 px-6 text-sm text-gray-500">{stats.username}</td>
              <td className="py-4 px-6 text-sm text-gray-500">{stats.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    </>
  );
};

export default Leaderboard;
