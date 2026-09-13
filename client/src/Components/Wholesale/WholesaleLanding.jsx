import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axiosInstance from '../../axiosInstance'

const WholesaleLanding = () => {
    const { user } = useSelector((state) => state.user)
    const location = useLocation()

    const [wholesaleStatus, setWholesaleStatus] = useState(null)
    const [requestData,     setRequestData]     = useState(null)

    // If redirected back from /wholesale/apply after successful submission
    const submitted = location.state?.submitted === true

    useEffect(() => {
        if (!user) { setWholesaleStatus('guest'); return }
        axiosInstance.get('/api/v1/users/wholesale/status')
            .then(res => {
                setWholesaleStatus(res.data.data.wholesaleStatus)
                setRequestData(res.data.data.wholesaleRequest)
            })
            .catch(() => setWholesaleStatus(user.wholesaleStatus || 'none'))
    }, [user])

    const canApply = user && (wholesaleStatus === 'none' || wholesaleStatus === 'rejected')

    // ── Status banners ─────────────────────────────────────────────────────────

    const StatusBanner = () => {
        if (wholesaleStatus === 'pending') return (
            <div className="max-w-xl mx-auto mb-10">
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-clock text-yellow-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-yellow-800 mb-1">
                        {submitted ? 'Request Submitted!' : 'Request Under Review'}
                    </h3>
                    <p className="text-yellow-700 text-sm">
                        {submitted
                            ? 'We received your wholesale request and will review it shortly.'
                            : 'Your request is being reviewed. We will notify you once a decision is made.'}
                    </p>
                    {requestData?.submittedAt && (
                        <p className="text-yellow-500 text-xs mt-2">
                            Submitted: {new Date(requestData.submittedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        )

        if (wholesaleStatus === 'approved') return (
            <div className="max-w-xl mx-auto mb-10">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-check-circle text-green-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-green-800 mb-1">Wholesale Access Active</h3>
                    <p className="text-green-700 text-sm mb-4">
                        Your account has wholesale access. Pricing will apply on qualifying orders once our pricing system is live.
                    </p>
                    <Link to="/shop" className="inline-flex items-center gap-2 bg-[#193246] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#244158] transition">
                        <i className="fas fa-shopping-bag"></i> Browse Products
                    </Link>
                </div>
            </div>
        )

        if (wholesaleStatus === 'rejected') return (
            <div className="max-w-xl mx-auto mb-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center shadow-sm">
                    <i className="fas fa-times-circle text-red-400 text-xl mb-2"></i>
                    <p className="text-red-700 font-medium text-sm">Your previous request was not approved.</p>
                    <p className="text-red-500 text-xs mt-1">You are welcome to reapply below.</p>
                </div>
            </div>
        )

        return null
    }

    // ── Page ───────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="bg-[#193246] text-white py-20 px-4 text-center relative overflow-hidden">
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
                </div>
                <div className="relative">
                    <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
                        Wholesale Program
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Fashionista Wholesale</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Grow your business with competitive bulk pricing. Built for boutiques,
                        home-based sellers, online stores, and Instagram businesses.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-14">

                {/* ── Status banners (shown when logged in with a status) ───── */}
                <StatusBanner />

                {/* ── Benefits grid ────────────────────────────────────────── */}
                <h2 className="text-2xl font-bold text-center text-[#193246] mb-8">
                    Why Partner with Fashionista?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                    {[
                        { icon: 'fas fa-tags',          title: 'Wholesale Pricing',      desc: 'Competitive bulk prices designed to help you grow your margins.' },
                        { icon: 'fas fa-boxes',         title: 'Full Catalog Access',     desc: 'Mix and match from the complete Fashionista range freely.' },
                        { icon: 'fas fa-handshake',     title: 'All Sellers Welcome',    desc: 'Home-based, boutique, Instagram — no formal registration needed.' },
                    ].map(b => (
                        <div key={b.title} className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-300 border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-[#193246]/8 flex items-center justify-center mx-auto mb-4"
                                 style={{ backgroundColor: 'rgba(25,50,70,0.08)' }}>
                                <i className={`${b.icon} text-xl text-[#193246]`}></i>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* ── Who qualifies ────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-14">
                    <h3 className="text-xl font-bold text-[#193246] mb-6 text-center">Who Can Apply?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { icon: 'fas fa-store',        label: 'Retail shops' },
                            { icon: 'fas fa-laptop',       label: 'Online stores' },
                            { icon: 'fab fa-instagram',    label: 'Instagram sellers' },
                            { icon: 'fas fa-home',         label: 'Home-based businesses' },
                            { icon: 'fas fa-exchange-alt', label: 'Resellers' },
                            { icon: 'fas fa-shopping-bag', label: 'Boutiques' },
                        ].map(q => (
                            <div key={q.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-[#193246] flex items-center justify-center flex-shrink-0">
                                    <i className={`${q.icon} text-white text-sm`}></i>
                                </div>
                                <span className="text-gray-700 text-sm font-medium">{q.label}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-6">
                        No tax ID required · No company registration required · Home-based sellers fully welcome
                    </p>
                </div>

                {/* ── How it works ─────────────────────────────────────────── */}
                <div className="mb-16">
                    <h3 className="text-xl font-bold text-center text-[#193246] mb-8">How It Works</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { step: '01', icon: 'fas fa-user-plus',    title: 'Create Account',   desc: 'Sign up for a free Fashionista account in under a minute.' },
                            { step: '02', icon: 'fas fa-file-alt',     title: 'Submit Request',   desc: 'Fill in a short form about your business and purchasing needs.' },
                            { step: '03', icon: 'fas fa-unlock-alt',   title: 'Get Access',       desc: 'Once approved, wholesale pricing applies on qualifying orders.' },
                        ].map(h => (
                            <div key={h.step} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#193246] text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {h.step}
                                </span>
                                <i className={`${h.icon} text-2xl text-[#193246] mt-4 mb-3 block`}></i>
                                <h4 className="font-semibold text-gray-900 mb-1">{h.title}</h4>
                                <p className="text-gray-500 text-sm">{h.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA section (shown when user can apply or is guest) ───── */}
                {(wholesaleStatus === 'none' || wholesaleStatus === 'rejected' || wholesaleStatus === 'guest') && (
                    <div className="relative rounded-3xl overflow-hidden mb-16">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#193246] to-[#0d1e2a]"></div>
                        <div className="absolute inset-0 opacity-5"
                            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                        </div>

                        <div className="relative px-8 py-12 text-center text-white">
                            <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
                                Ready to start?
                            </span>
                            <h2 className="text-3xl font-bold mb-3">Want to become a wholesale buyer?</h2>
                            <p className="text-gray-300 text-base max-w-lg mx-auto mb-8">
                                It only takes 2 minutes. No company registration or tax ID required.
                            </p>

                            {wholesaleStatus === 'guest' ? (
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link
                                        to="/login"
                                        state={{ returnTo: '/wholesale' }}
                                        className="inline-flex items-center justify-center gap-2 bg-white text-[#193246] px-7 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all shadow-lg"
                                    >
                                        <i className="fas fa-sign-in-alt"></i> Log In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all"
                                    >
                                        <i className="fas fa-user-plus"></i> Create Free Account
                                    </Link>
                                </div>
                            ) : canApply ? (
                                <Link
                                    to="/wholesale/apply"
                                    className="inline-flex items-center gap-3 bg-white text-[#193246] px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                                    style={{ transition: 'all 0.2s ease' }}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                    Apply Now — It's Free
                                    <i className="fas fa-arrow-right text-xs opacity-60"></i>
                                </Link>
                            ) : null}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default WholesaleLanding
