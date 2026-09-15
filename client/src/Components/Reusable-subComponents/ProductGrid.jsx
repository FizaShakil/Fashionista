import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axiosInstance from '../../axiosInstance'
import { useHandleAddToCart } from './HandleAddToCart'

/**
 * Shared ProductGrid component used across all product listing pages.
 *
 * Props:
 *   lockedFilters  — object of filters that are pre-set and hidden from the user
 *                    e.g. { gender: 'Male' } on the Men page
 *                    e.g. { category: 'sweaters' } on a CategoryPage
 *                    e.g. { newArrival: 'true' } on the New Arrivals page
 *   showFilters    — whether to show the filter panel (default: true)
 */
const ProductGrid = ({ lockedFilters = {}, showFilters = true }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const handleAddToCart = useHandleAddToCart()

  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])

  // User-controlled filters (from URL params, excluding locked ones)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    color:    searchParams.get('color')    || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sale:     searchParams.get('sale') === 'true',
    sort:     searchParams.get('sort')  || 'newest',
    page:     parseInt(searchParams.get('page') || '1', 10),
  })

  // Build full query merging locked + user filters
  const buildParams = useCallback((f) => {
    const params = new URLSearchParams()

    // Locked filters (hidden, always applied)
    Object.entries(lockedFilters).forEach(([k, v]) => {
      if (v) params.append(k, v)
    })

    // User-controlled filters
    if (f.search)   params.append('search',   f.search)
    // Only add category if not locked
    if (f.category && !lockedFilters.category) params.append('category', f.category)
    if (f.color)    params.append('color',    f.color)
    if (f.minPrice) params.append('minPrice', f.minPrice)
    if (f.maxPrice) params.append('maxPrice', f.maxPrice)
    if (f.sale)     params.append('sale',     'true')
    params.append('sort',  f.sort)
    params.append('page',  f.page)
    params.append('limit', 12)

    return params
  }, [lockedFilters])

  const fetchProducts = useCallback(async (f) => {
    setLoading(true)
    try {
      const params = buildParams(f)
      const res = await axiosInstance.get(`/api/v1/products/search?${params.toString()}`)
      setProducts(res.data.data.products || [])
      setPagination(res.data.data.pagination || {})
    } catch {
      setProducts([])
      setPagination({})
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  // Fetch categories for dropdown (only when category filter is user-controlled)
  useEffect(() => {
    if (!lockedFilters.category) {
      axiosInstance
        .get('/api/v1/categories')
        .then(res => setCategories(res.data.data || []))
        .catch(() => setCategories([]))
    }
  }, [lockedFilters.category])

  // Extract colors from results
  useEffect(() => {
    const set = new Set()
    products.forEach(p => p.colors?.forEach(c => set.add(c)))
    setColors(Array.from(set).sort())
  }, [products])

  // Fetch when filters change
  useEffect(() => {
    // Sync user-controlled filters to URL (not locked filters)
    const urlParams = new URLSearchParams()
    if (filters.search)   urlParams.set('search',   filters.search)
    if (filters.category && !lockedFilters.category) urlParams.set('category', filters.category)
    if (filters.color)    urlParams.set('color',    filters.color)
    if (filters.minPrice) urlParams.set('minPrice', filters.minPrice)
    if (filters.maxPrice) urlParams.set('maxPrice', filters.maxPrice)
    if (filters.sale)     urlParams.set('sale',     'true')
    urlParams.set('sort', filters.sort)
    urlParams.set('page', filters.page)
    setSearchParams(urlParams, { replace: true })

    fetchProducts(filters)
  }, [filters]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))

  const clearFilters = () =>
    setFilters({ search: '', category: '', color: '', minPrice: '', maxPrice: '', sale: false, sort: 'newest', page: 1 })

  const changePage = (p) => {
    setFilters(prev => ({ ...prev, page: p }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { page = 1, limit = 12, total = 0, totalPages = 0, hasNextPage, hasPreviousPage } = pagination

  // Determine if any user-applied filter is active (for "clear" visibility)
  const hasActiveFilters = filters.search || filters.category || filters.color ||
    filters.minPrice || filters.maxPrice || filters.sale || filters.sort !== 'newest'

  return (
    <div className="w-[90%] mx-auto mt-8 pb-8">

      {/* ── Filter Panel ─────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Filters</span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-[#22425d] hover:underline">
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">

            {/* Search */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={e => set('search', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#22425d]"
              />
            </div>

            {/* Category — hidden if locked */}
            {!lockedFilters.category && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={e => set('category', e.target.value)}
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#22425d]"
                >
                  <option value="">All</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Gender — hidden if locked */}
            {!lockedFilters.gender && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Gender</label>
                <select
                  value={filters.gender || ''}
                  onChange={e => set('gender', e.target.value)}
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#22425d]"
                >
                  <option value="">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            )}

            {/* Color */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Color</label>
              <select
                value={filters.color}
                onChange={e => set('color', e.target.value)}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#22425d]"
              >
                <option value="">All</option>
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min (PKR)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={e => set('minPrice', e.target.value)}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#22425d]"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max (PKR)</label>
              <input
                type="number"
                placeholder="Any"
                value={filters.maxPrice}
                onChange={e => set('maxPrice', e.target.value)}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#22425d]"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sort</label>
              <select
                value={filters.sort}
                onChange={e => set('sort', e.target.value)}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#22425d]"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="name_asc">A → Z</option>
                <option value="name_desc">Z → A</option>
              </select>
            </div>

            {/* Sale */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.sale}
                  onChange={() => set('sale', !filters.sale)}
                  className="w-4 h-4 accent-[#22425d]"
                />
                <span className="text-sm text-gray-700">On Sale</span>
              </label>
            </div>

          </div>
        </div>
      )}

      {/* ── Results count ─────────────────────────────────────────────────── */}
      <div className="mb-4 text-sm text-gray-500">
        {loading ? 'Loading...' : (
          total > 0
            ? `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total} products`
            : ''
        )}
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No products found.{hasActiveFilters ? ' Try adjusting your filters.' : ''}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white shadow-sm rounded-lg p-4 text-center hover:shadow-md transition duration-200 border border-gray-50"
            >
              <Link to={`/productpage/${product._id}`}>
                <img
                  src={product.productImage}
                  alt={product.name || 'Product'}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              </Link>
              <h3 className="text-base font-semibold text-[#0b1a26] truncate">{product.name}</h3>

              <p className="text-sm text-gray-600 mt-1">
                {product.pricing?.salePrice ? (
                  <>
                    <span className="line-through text-gray-400 mr-1">PKR {product.pricing.regularPrice}</span>
                    <span className="text-red-600 font-semibold">PKR {product.pricing.salePrice}</span>
                  </>
                ) : (
                  <span>PKR {product.pricing?.effectivePrice ?? product.price}</span>
                )}
              </p>

              {product.colors?.length > 0 && (
                <p className="text-xs text-gray-400 mt-1 truncate">{product.colors.join(' · ')}</p>
              )}

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 w-full border-2 px-4 py-1.5 rounded-md bg-[#22425d] text-white text-sm hover:bg-white hover:text-[#22425d] hover:border-[#22425d] transition duration-200"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-10 flex-wrap">
          <button
            onClick={() => changePage(page - 1)}
            disabled={!hasPreviousPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`px-3 py-2 text-sm rounded-md ${
                p === page ? 'bg-[#22425d] text-white' : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => changePage(page + 1)}
            disabled={!hasNextPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
