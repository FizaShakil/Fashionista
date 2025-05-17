import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance"; 

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/users/get-all-users");
      console.log(res.data.data)
      setUsers(res.data.data); 
    } catch (error) {
      console.error("Failed to fetch users: ", error);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">All Users List</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Email</th>
               <th className="p-3 border">Created At</th>
              <th className="p-3 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.createdAt}</td>
                <td className="p-2 border">{user.updatedAt}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
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
