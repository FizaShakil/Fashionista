import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axiosInstance from '../../axiosInstance'
import WholesaleRequestForm from './WholesaleRequestForm'

const WholesaleApply = () => {
    const { user }   = useSelector((state) => state.user)
    const navigate   = useNavigate()
    const [status, setStatus] = useState(null) // null = loading

    useEffect(() => {
        // Not logged in — send to login, return here after
        if (user === null) {
            navigate('/login', { state: { returnTo: '/wholesale/apply' } })
            return
        }
        if (!user) return // still initialising

        axiosInstance.get('/api/v1/users/wholesale/status')
            .then(res => setStatus(res.data.data.wholesaleStatus))
            .catch(() => setStatus(user.wholesaleStatus || 'none'))
    }, [user, navigate])

    const handleSuccess = () => {
        navigate('/wholesale', { state: { submitted: true } })
    }

    // ── Guards ─────────────────────────────────────────────────────────────────

    if (status === null) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#193246]"></div>
            </div>
        )
    }

    if (status === 'pending') {
        return (
            <div className="min-h-[400px] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-clock text-yellow-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">Request Already Submitted</h3>
                    <p className="text-yellow-700 text-sm mb-5">
                        Your wholesale request is currently under review. We'll notify you once a decision is made.
                    </p>
                    <Link to="/wholesale" className="inline-flex items-center gap-2 bg-[#193246] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#244158] transition">
                        <i className="fas fa-arrow-left text-xs"></i> Back to Wholesale
                    </Link>
                </div>
            </div>
        )
    }

    if (status === 'approved') {
        return (
            <div className="min-h-[400px] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-check-circle text-green-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-green-800 mb-2">You Already Have Wholesale Access</h3>
                    <p className="text-green-700 text-sm mb-5">
                        Your account has wholesale access. Head to the shop to browse products.
                    </p>
                    <Link to="/shop" className="inline-flex items-center gap-2 bg-[#193246] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#244158] transition">
                        <i className="fas fa-shopping-bag text-xs"></i> Browse Products
                    </Link>
                </div>
            </div>
        )
    }

    // status === 'none' or 'rejected' — show the form
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Back link */}
                <Link
                    to="/wholesale"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#193246] mb-6 transition"
                >
                    <i className="fas fa-arrow-left text-xs"></i> Back to Wholesale
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#193246]">Wholesale Application</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        No company registration or tax ID required. Takes about 2 minutes.
                    </p>
                </div>

                {/* Rejected notice */}
                {status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <i className="fas fa-info-circle text-red-400 mt-0.5"></i>
                        <div>
                            <p className="text-red-700 text-sm font-medium">Your previous request was not approved.</p>
                            <p className="text-red-500 text-xs mt-0.5">You are welcome to reapply with updated information.</p>
                        </div>
                    </div>
                )}

                {/* Form card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <WholesaleRequestForm onSuccess={handleSuccess} />
                </div>

            </div>
        </div>
    )
}

export default WholesaleApply
