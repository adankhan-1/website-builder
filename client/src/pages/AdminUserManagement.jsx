import { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AdminUserManagement() {
  const { type } = useParams();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(type || 'all');

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/user/all`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`${backendBaseUrl}/api/user/approve/${id}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, approved: true } : user
        )
      );
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    filter === 'all' ? true : !user.approved
  );

  return (
    <div className="min-h-screen bg-image p-8">
      <BackButton />
      <LogoutButton />

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-cyan-700">
          User Management
        </h2>

        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-md ${
              filter === "all" ? "bg-cyan-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-r-md ${
              filter === "unapproved" ? "bg-cyan-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("unapproved")}
          >
            Unapproved
          </button>
        </div>

        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Joined</th>
              {filter === "unapproved" && (
                <th className="px-4 py-2">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                {filter === "unapproved" && (
                  <td className="px-4 py-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleApprove(user.id)}
                    >
                      Approve
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={filter === "unapproved" ? 4 : 3}
                  className="text-center text-gray-500 py-4"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}