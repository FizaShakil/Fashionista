import React, { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'

const STATUS_COLORS = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    none:     'bg-gray-100 text-gray-600'
}

const WholesaleRequests = () => {
    const [requests, setRequests]   = useState([])
    const [filter,   setFilter]     = useState('pending')
    const [loading,  setLoading]    = useState(true)
    const [error,    setError]      = useState('')
    const [updating, setUpdating]   = useState(null) // userId being updated

    const fetchRequests = async (status) => {
        setLoading(true)
        setError('')
        try {
            const res = await axiosInstance.get(
                `/api/v1/users/wholesale/admin/requests?status=${status}`
            )
            setRequests(res.data.data || [])
        } catch (err) {
            setError('Failed to fetch wholesale requests.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests(filter)
    }, [filter])

    const handleStatusChange = async (req, newStatus) => {
        // req._id is the WholesaleRequest doc ID
        // req.userId is the User ID — required by the PATCH endpoint
        setUpdating(req._id)
        try {
            await axiosInstance.patch(
                `/api/v1/users/wholesale/admin/${req.userId}/status`,
                { status: newStatus }
            )
            fetchRequests(filter)
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.')
        } finally {
            setUpdating(null)
        }
    }

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-2xl font-bold mb-6">Wholesale Requests</h2>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['pending', 'approved', 'rejected', 'all'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
                            filter === s
                                ? 'bg-[#193246] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-600 py-10">{error}</div>
            ) : requests.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    No {filter} wholesale requests found.
                </div>
            ) : (
                <div className="space-y-6">
                    {requests.map(req => (
                        <div
                            key={req._id}
                            className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition"
                        >
                            {/* Header row */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                <div>
                                    <span className="font-semibold text-gray-800 text-lg">{req.username}</span>
                                    <span className="text-gray-500 ml-2 text-sm">{req.email}</span>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[req.wholesaleStatus] || 'bg-gray-100'}`}>
                                        {req.wholesaleStatus}
                                    </span>
                                    {req.wholesaleRequest?.submittedAt && (
                                        <span className="text-xs text-gray-400">
                                            Submitted: {new Date(req.wholesaleRequest.submittedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Onboarding details */}
                            {req.wholesaleRequest && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">Business Type</p>
                                        <p className="font-medium text-gray-700">{req.wholesaleRequest.businessType || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">Expected Quantity</p>
                                        <p className="font-medium text-gray-700">{req.wholesaleRequest.expectedQuantity || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">Order Frequency</p>
                                        <p className="font-medium text-gray-700">{req.wholesaleRequest.expectedFrequency || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">City</p>
                                        <p className="font-medium text-gray-700">{req.wholesaleRequest.city || '—'}</p>
                                    </div>
                                    {req.wholesaleRequest.storeName && (
                                        <div>
                                            <p className="text-gray-400 text-xs mb-0.5">Store Name</p>
                                            <p className="font-medium text-gray-700">{req.wholesaleRequest.storeName}</p>
                                        </div>
                                    )}
                                    {req.wholesaleRequest.website && (
                                        <div>
                                            <p className="text-gray-400 text-xs mb-0.5">Website</p>
                                            <a href={req.wholesaleRequest.website} target="_blank" rel="noreferrer"
                                               className="text-blue-600 hover:underline text-sm">
                                                {req.wholesaleRequest.website}
                                            </a>
                                        </div>
                                    )}
                                    {req.wholesaleRequest.instagramProfile && (
                                        <div>
                                            <p className="text-gray-400 text-xs mb-0.5">Instagram / Social</p>
                                            <p className="font-medium text-gray-700">{req.wholesaleRequest.instagramProfile}</p>
                                        </div>
                                    )}
                                    {req.wholesaleRequest.otherInfo && (
                                        <div className="col-span-2 md:col-span-4">
                                            <p className="text-gray-400 text-xs mb-0.5">Other Info</p>
                                            <p className="font-medium text-gray-700">{req.wholesaleRequest.otherInfo}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Optional company details if any were provided */}
                            {(req.companyDetails?.taxId || req.companyDetails?.companyName) && (
                                <div className="text-xs text-gray-500 mb-3">
                                    {req.companyDetails.companyName && (
                                        <span className="mr-4">Company: {req.companyDetails.companyName}</span>
                                    )}
                                    {req.companyDetails.taxId && (
                                        <span>Tax ID: {req.companyDetails.taxId}</span>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3 flex-wrap mt-2">
                                {req.wholesaleStatus !== 'approved' && (
                                    <button
                                        onClick={() => handleStatusChange(req, 'approved')}
                                        disabled={updating === req._id}
                                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded font-medium disabled:opacity-50 transition"
                                    >
                                        {updating === req._id ? 'Updating...' : 'Approve'}
                                    </button>
                                )}
                                {req.wholesaleStatus !== 'rejected' && (
                                    <button
                                        onClick={() => handleStatusChange(req, 'rejected')}
                                        disabled={updating === req._id}
                                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-medium disabled:opacity-50 transition"
                                    >
                                        {updating === req._id ? 'Updating...' : 'Reject'}
                                    </button>
                                )}
                                {req.wholesaleStatus !== 'none' && (
                                    <button
                                        onClick={() => handleStatusChange(req, 'none')}
                                        disabled={updating === req._id}
                                        className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded font-medium disabled:opacity-50 transition"
                                    >
                                        Reset to None
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WholesaleRequests
