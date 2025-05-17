import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance"; 

const ItemsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/products/get-product-details");
      setProducts(res.data.data); 
    } catch (error) {
      console.error("Failed to fetch products: ", error);
    }
  };

  const handleDelete = async (productUniqueID) => {
     const confirmDelete = window.confirm("Are you sure you want to delete this product?");
     if (!confirmDelete) return;
    try {
      await axiosInstance.delete(`/api/v1/products/delete-product-details`, 
        {data: { productUniqueID: id }});
        confirm("Are you sure want to delete the product from List ? ")
      setProducts(products.filter(item => item.productUniqueID !== productUniqueID));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">All Products List</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Name</th>
               <th className="p-3 border">Product Unique ID</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <img
                    src={item.productImage}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.productUniqueID}</td>
                <td className="p-2 border">{item.gender}</td>
                <td className="p-2 border">PKR {item.price}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(item.productUniqueID)}
                    className="text-red-500 hover:text-red-700 fas fa-trash"
                  >
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsList;
