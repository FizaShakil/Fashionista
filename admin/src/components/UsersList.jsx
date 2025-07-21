import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance"; 

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/users/get-all-users");
      setUsers(res.data.data); 
    } catch (error) {
      console.error("Failed to fetch users: ", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">All Users List</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-base">
              <th className="py-2 px-2 text-left">Username</th>
              <th className="py-2 px-2 text-left">Email</th>
              <th className="py-2 px-2 text-left">Created At</th>
              <th className="py-2 px-2 text-left">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-2 font-medium text-gray-800">{user.username}</td>
                <td className="py-2 px-2 text-blue-700">{user.email}</td>
                <td className="py-2 px-2 text-gray-600">{new Date(user.createdAt).toLocaleString()}</td>
                <td className="py-2 px-2 text-gray-600">{new Date(user.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500 text-base">
                  No Users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
