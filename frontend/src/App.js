import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  LogOut,
  Filter,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [username, setUsername] = useState("");

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [productForm, setProductForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      let url = `${API_BASE_URL}/products/?page=${currentPage}&ordering=${sortBy}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (searchTerm) url += `&search=${searchTerm}`;

      const response = await fetch(url);
      const data = await response.json();

      setProducts(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10));
    } catch (err) {
      setError(
        "Failed to fetch products. Make sure your Django server is running!"
      );
    }
  };

  const handleAuth = async () => {
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE_URL}/auth/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: authForm.username,
            password: authForm.password,
          }),
        });

        if (!response.ok)
          throw new Error("Login failed. Check your credentials.");

        const data = await response.json();
        setAuthToken(data.access);
        setUsername(authForm.username);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setSuccess("Login successful!");
        resetAuthForm();
      } else {
        if (authForm.password !== authForm.password2) {
          setError("Passwords do not match");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: authForm.username,
            email: authForm.email,
            password: authForm.password,
            password2: authForm.password2,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(Object.values(errorData).flat().join(", "));
        }

        setSuccess("Registration successful! Please login.");
        setIsLogin(true);
        resetAuthForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setAuthToken("");
    setUsername("");
    setIsAuthenticated(false);
    setSuccess("Logged out successfully");
  };

  const handleProductSubmit = async () => {
    setError("");
    setSuccess("");

    if (!isAuthenticated) {
      setError("Please login to manage products");
      return;
    }

    try {
      const method = productForm.id ? "PUT" : "POST";
      const url = productForm.id
        ? `${API_BASE_URL}/products/${productForm.id}/`
        : `${API_BASE_URL}/products/`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(productForm),
      });

      if (!response.ok) throw new Error("Failed to save product");

      setSuccess(productForm.id ? "Product updated!" : "Product created!");
      setShowProductModal(false);
      resetProductForm();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setSuccess("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: product.category,
    });
    setShowProductModal(true);
  };

  const resetAuthForm = () => {
    setAuthForm({ username: "", email: "", password: "", password2: "" });
  };

  const resetProductForm = () => {
    setProductForm({
      id: null,
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      category: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">
              E-Shop Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Welcome, {username}!</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsLogin(true);
                }}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <User size={18} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Alerts */}
      {(error || success) && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
              <button
                onClick={() => setError("")}
                className="absolute top-3 right-3"
              >
                <X size={18} />
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {success}
              <button
                onClick={() => setSuccess("")}
                className="absolute top-3 right-3"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="-name">Name: Z-A</option>
            </select>

            {/* Add Product Button */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  resetProductForm();
                  setShowProductModal(true);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              No products found.{" "}
              {isAuthenticated && 'Click "Add Product" to create one!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <ShoppingCart className="text-white" size={64} />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                      {product.name}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full whitespace-nowrap ml-2">
                      {product.category_name}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock_quantity}
                    </span>
                  </div>

                  {isAuthenticated && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isLogin ? "Login" : "Register"}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={authForm.username}
                onChange={(e) =>
                  setAuthForm({ ...authForm, username: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {!isLogin && (
                <input
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={authForm.password2}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password2: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              <button
                onClick={handleAuth}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-blue-600 hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {productForm.id ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <textarea
                placeholder="Description"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />

              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Stock Quantity"
                value={productForm.stock_quantity}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    stock_quantity: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <select
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({ ...productForm, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleProductSubmit}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
              >
                {productForm.id ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
