import React, { useState } from 'react'
import axiosInstance from '../../axiosInstance'

// ── Constants (module-level, never recreated) ─────────────────────────────────

const BUSINESS_TYPES = [
    { value: 'Retail shop',                 icon: 'fas fa-store',        label: 'Retail Shop' },
    { value: 'Online store',                icon: 'fas fa-laptop',       label: 'Online Store' },
    { value: 'Instagram/Facebook business', icon: 'fas fa-hashtag',      label: 'Instagram / Facebook' },
    { value: 'Home-based business',         icon: 'fas fa-home',         label: 'Home-based' },
    { value: 'Reseller',                    icon: 'fas fa-exchange-alt', label: 'Reseller' },
    { value: 'Boutique',                    icon: 'fas fa-shopping-bag', label: 'Boutique' },
    { value: 'Other',                       icon: 'fas fa-ellipsis-h',   label: 'Other' },
]

const QUANTITIES = [
    { value: '5–9 pieces',   label: '5 – 9',   sub: 'pieces' },
    { value: '10–24 pieces', label: '10 – 24', sub: 'pieces' },
    { value: '25–49 pieces', label: '25 – 49', sub: 'pieces' },
    { value: '50–99 pieces', label: '50 – 99', sub: 'pieces' },
    { value: '100+ pieces',  label: '100+',    sub: 'pieces' },
]

const FREQUENCIES = [
    { value: 'One-time',            icon: 'fas fa-flag',         label: 'One-time' },
    { value: 'Monthly',             icon: 'fas fa-calendar-alt', label: 'Monthly' },
    { value: '2–3 times per month', icon: 'fas fa-redo',         label: '2–3× / month' },
    { value: 'Regularly',           icon: 'fas fa-bolt',         label: 'Regularly' },
]

const STEPS = ['Business', 'Volume', 'Details', 'Review']

// ── Step components defined OUTSIDE the parent so their identity is stable.
// If defined inside, every parent state update creates a new component type,
// React unmounts/remounts them, and inputs lose focus after each keystroke. ──

const ReviewRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
        <i className={`${icon} text-[#193246] mt-0.5 w-4 text-center`}></i>
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
    </div>
)

const Step0 = ({ form, set, slideStyle }) => (
    <div style={slideStyle}>
        <p className="text-gray-500 text-sm mb-5">What best describes your business?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BUSINESS_TYPES.map(bt => (
                <button
                    key={bt.value}
                    type="button"
                    onClick={() => set('businessType', bt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer
                        ${form.businessType === bt.value
                            ? 'border-[#193246] bg-[#193246] text-white shadow-lg scale-[1.03]'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#193246] hover:bg-gray-50'
                        }`}
                >
                    <i className={`${bt.icon} text-xl ${form.businessType === bt.value ? 'text-white' : 'text-[#193246]'}`}></i>
                    <span>{bt.label}</span>
                </button>
            ))}
        </div>
    </div>
)

const Step1 = ({ form, set, slideStyle }) => (
    <div style={slideStyle}>
        <p className="text-gray-500 text-sm mb-5">How much do you expect to order at a time?</p>
        <div className="flex flex-wrap gap-3 mb-8">
            {QUANTITIES.map(q => (
                <button
                    key={q.value}
                    type="button"
                    onClick={() => set('expectedQuantity', q.value)}
                    className={`flex flex-col items-center px-5 py-3 rounded-xl border-2 font-semibold transition-all duration-200 min-w-[80px]
                        ${form.expectedQuantity === q.value
                            ? 'border-[#193246] bg-[#193246] text-white shadow-md scale-[1.05]'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#193246]'
                        }`}
                >
                    <span className="text-lg">{q.label}</span>
                    <span className={`text-xs ${form.expectedQuantity === q.value ? 'text-gray-200' : 'text-gray-400'}`}>{q.sub}</span>
                </button>
            ))}
        </div>

        <p className="text-gray-500 text-sm mb-4">How often do you plan to order?</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FREQUENCIES.map(f => (
                <button
                    key={f.value}
                    type="button"
                    onClick={() => set('expectedFrequency', f.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200
                        ${form.expectedFrequency === f.value
                            ? 'border-[#193246] bg-[#193246] text-white shadow-md scale-[1.03]'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#193246] hover:bg-gray-50'
                        }`}
                >
                    <i className={`${f.icon} text-lg ${form.expectedFrequency === f.value ? 'text-white' : 'text-[#193246]'}`}></i>
                    <span>{f.label}</span>
                </button>
            ))}
        </div>
    </div>
)

const Step2 = ({ form, set, slideStyle }) => (
    <div style={slideStyle}>
        <p className="text-gray-500 text-sm mb-5">
            City and business name are required — everything else is optional.
        </p>
        <div className="space-y-4">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-map-marker-alt"></i>
                </span>
                <input
                    type="text"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    placeholder="City / Location *"
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#193246] focus:border-transparent transition"
                />
            </div>

            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-store"></i>
                </span>
                <input
                    type="text"
                    value={form.storeName}
                    onChange={e => set('storeName', e.target.value)}
                    placeholder="Business / Store name *"
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#193246] focus:border-transparent transition"
                />
            </div>

            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fab fa-instagram"></i>
                </span>
                <input
                    type="text"
                    value={form.instagramProfile}
                    onChange={e => set('instagramProfile', e.target.value)}
                    placeholder="Instagram / Social profile (optional)"
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#193246] focus:border-transparent transition"
                />
            </div>

            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-globe"></i>
                </span>
                <input
                    type="text"
                    value={form.website}
                    onChange={e => set('website', e.target.value)}
                    placeholder="Website (optional)"
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#193246] focus:border-transparent transition"
                />
            </div>

            <textarea
                value={form.otherInfo}
                onChange={e => set('otherInfo', e.target.value)}
                rows={3}
                placeholder="Anything else you'd like us to know? (optional)"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#193246] focus:border-transparent transition resize-none"
            />
        </div>
        <p className="text-xs text-gray-400 mt-3">No company registration or tax ID required.</p>
    </div>
)

const Step3 = ({ form, error, slideStyle }) => (
    <div style={slideStyle}>
        <p className="text-gray-500 text-sm mb-5">Review your details before submitting.</p>
        <div className="space-y-3">
            <ReviewRow icon="fas fa-briefcase"    label="Business Type"     value={form.businessType} />
            <ReviewRow icon="fas fa-boxes"        label="Expected Quantity" value={form.expectedQuantity} />
            <ReviewRow icon="fas fa-calendar-alt" label="Order Frequency"   value={form.expectedFrequency} />
            <ReviewRow icon="fas fa-map-marker-alt" label="City"            value={form.city} />
            <ReviewRow icon="fas fa-store"        label="Store Name"        value={form.storeName} />
            {form.instagramProfile && <ReviewRow icon="fab fa-instagram" label="Instagram"  value={form.instagramProfile} />}
            {form.website          && <ReviewRow icon="fas fa-globe"     label="Website"    value={form.website} />}
            {form.otherInfo        && <ReviewRow icon="fas fa-comment"   label="Other Info" value={form.otherInfo} />}
        </div>
        {error && (
            <div className="mt-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>{error}
            </div>
        )}
    </div>
)

// ── Main form component ───────────────────────────────────────────────────────

const WholesaleRequestForm = ({ onSuccess }) => {
    const [step, setStep] = useState(0)
    const [form, setForm] = useState({
        businessType:      '',
        expectedQuantity:  '',
        expectedFrequency: '',
        city:              '',
        storeName:         '',
        website:           '',
        instagramProfile:  '',
        otherInfo:         ''
    })
    const [loading,   setLoading]   = useState(false)
    const [error,     setError]     = useState('')
    const [animating, setAnimating] = useState(false)
    const [direction, setDirection] = useState('forward')

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

    const goTo = (next) => {
        setDirection(next > step ? 'forward' : 'back')
        setAnimating(true)
        setTimeout(() => {
            setStep(next)
            setAnimating(false)
        }, 220)
    }

    const canNext = () => {
        if (step === 0) return !!form.businessType
        if (step === 1) return !!form.expectedQuantity && !!form.expectedFrequency
        if (step === 2) return !!form.city.trim() && !!form.storeName.trim()
        return true
    }

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            await axiosInstance.post('/api/v1/users/wholesale/request', form)
            onSuccess()
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const slideStyle = {
        transition: 'opacity 220ms ease, transform 220ms ease',
        opacity:   animating ? 0 : 1,
        transform: animating
            ? `translateX(${direction === 'forward' ? '24px' : '-24px'})`
            : 'translateX(0)'
    }

    // Render the current step by index — NOT via dynamic component lookup,
    // which would also cause remounting.
    const renderStep = () => {
        if (step === 0) return <Step0 form={form} set={set} slideStyle={slideStyle} />
        if (step === 1) return <Step1 form={form} set={set} slideStyle={slideStyle} />
        if (step === 2) return <Step2 form={form} set={set} slideStyle={slideStyle} />
        return             <Step3 form={form} error={error} slideStyle={slideStyle} />
    }

    return (
        <div>
            {/* Progress bar */}
            <div className="flex items-center mb-8">
                {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                                ${i < step  ? 'bg-green-500 text-white' :
                                  i === step ? 'bg-[#193246] text-white ring-4 ring-[#193246]/20' :
                                               'bg-gray-200 text-gray-400'}`}>
                                {i < step ? <i className="fas fa-check text-xs"></i> : i + 1}
                            </div>
                            <span className={`text-xs hidden sm:block ${i === step ? 'text-[#193246] font-semibold' : 'text-gray-400'}`}>
                                {s}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step content */}
            <div className="min-h-[220px]">
                {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    disabled={step === 0}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${step === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    <i className="fas fa-arrow-left text-xs"></i> Back
                </button>

                {step < STEPS.length - 1 ? (
                    <button
                        type="button"
                        onClick={() => canNext() && goTo(step + 1)}
                        disabled={!canNext()}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                            ${canNext()
                                ? 'bg-[#193246] text-white hover:bg-[#244158] shadow-md hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Continue <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                            ${loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {loading
                            ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</>
                            : <><i className="fas fa-paper-plane"></i> Submit Request</>
                        }
                    </button>
                )}
            </div>
        </div>
    )
}

export default WholesaleRequestForm
