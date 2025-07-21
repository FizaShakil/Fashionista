import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance"; 
import EditProductModal from "./EditProductModal";

const ItemsList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

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
        {data: { productUniqueID: productUniqueID }});
        confirm("Are you sure want to delete the product from List ? ")
      setProducts(products.filter(item => item.productUniqueID !== productUniqueID));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleEditSave = (updatedProduct) => {
    setProducts(products => products.map(p =>
      p.productUniqueID === updatedProduct.productUniqueID ? { ...p, ...updatedProduct } : p
    ));
  };

  const filteredProducts = products.filter(product => {
    const searchLower = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.productUniqueID.toLowerCase().includes(searchLower) ||
      (product.gender && product.gender.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">All Products List</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by name, unique ID, or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-base">
              <th className="py-2 px-2 text-left">Image</th>
              <th className="py-2 px-2 text-left">Name</th>
              <th className="py-2 px-2 text-left">Product Unique ID</th>
              <th className="py-2 px-2 text-left">Category</th>
              <th className="py-2 px-2 text-left">Price</th>
              <th className="py-2 px-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item) => (
              <tr key={item._id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-2">
                  <img
                    src={item.productImage}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-2 font-medium text-gray-800">{item.name}</td>
                <td className="py-2 px-2 text-blue-700">{item.productUniqueID}</td>
                <td className="py-2 px-2 text-gray-600">{item.gender}</td>
                <td className="py-2 px-2 text-green-700">PKR {item.price}</td>
                <td className="py-2 px-2 text-center flex gap-3 items-center justify-center">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-blue-500 hover:text-blue-700 text-lg"
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(item.productUniqueID)}
                    className="text-red-500 hover:text-red-700 fas fa-trash"
                    title="Delete"
                  >
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500 text-base">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );

  function handleEditClick(product) {
    setEditingProduct(product);
  }
};

export default ItemsList;
