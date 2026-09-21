/**
 * Phase 3 — Centralized Pricing Service
 * =======================================
 * Single source of truth for all effective price calculations.
 *
 * Three concepts are kept separate (do NOT conflate them):
 *   A. Wholesale account eligibility  — is the customer approved?
 *   B. Wholesale order qualification  — does quantity meet wholesaleMOQ?
 *   C. Wholesale product availability — does this product have wholesale pricing?
 *
 * IMPORTANT — Phase 3 pricing rule:
 *   Wholesale pricing requires ALL THREE to be true simultaneously.
 *   customerType === 'wholesale' alone is NOT sufficient.
 *
 * This service has no dependency on Express req/res so it can be reused
 * by product APIs, cart, checkout, order creation, and admin calculations.
 */

// ── Customer context helpers ───────────────────────────────────────────────

/**
 * Build a customer context object from a User document (or null for guests).
 * This is the only shape the pricing service accepts — never raw req.user.
 *
 * @param {object|null} user - Mongoose User document or null for guests
 * @returns {{ userId, customerType, wholesaleStatus }}
 */
export const buildCustomerContext = (user) => {
    if (!user) {
        return {
            userId:          null,
            customerType:    'retail',
            wholesaleStatus: 'none'
        }
    }
    return {
        userId:          user._id,
        customerType:    user.customerType    || 'retail',
        wholesaleStatus: user.wholesaleStatus || 'none'
    }
}

/**
 * Determine whether a customer context is wholesale-eligible.
 * Eligibility requires BOTH customerType and wholesaleStatus to be correct.
 * This is A (account eligibility) only — not B or C.
 *
 * @param {{ customerType, wholesaleStatus }} ctx
 * @returns {boolean}
 */
const isWholesaleEligible = (ctx) =>
    ctx.customerType    === 'wholesale' &&
    ctx.wholesaleStatus === 'approved'

// ── Core pricing function ──────────────────────────────────────────────────

/**
 * Resolve the effective price for a product given a customer context and quantity.
 *
 * Returns a structured result describing:
 *   - which pricing tier applies (retail | wholesale)
 *   - whether the customer is eligible, the product is available, and MOQ is met
 *   - the regular price, sale price, and final effective price
 *   - the wholesaleMOQ for UI display
 *
 * @param {object} product              - Mongoose Product document (lean or full)
 * @param {{ userId, customerType, wholesaleStatus }} customerCtx
 * @param {number} [quantity=1]         - Requested quantity (used for MOQ check)
 * @returns {{
 *   customerType:         string,
 *   pricingType:          'retail' | 'wholesale',
 *   isWholesaleEligible:  boolean,
 *   isWholesaleAvailable: boolean,
 *   meetsMOQ:             boolean,
 *   regularPrice:         number,
 *   salePrice:            number | null,
 *   effectivePrice:       number,
 *   wholesaleMOQ:         number | null
 * }}
 */
export const getEffectivePrice = (product, customerCtx, quantity = 1) => {

    const eligible = isWholesaleEligible(customerCtx)

    // ── A. Wholesale product availability check ──────────────────────────────
    // A product is wholesale-available only if wholesaleRegularPrice is set
    // and is a valid positive number.
    const wholesaleAvailable =
        typeof product.wholesaleRegularPrice === 'number' &&
        product.wholesaleRegularPrice > 0

    const moq = (typeof product.wholesaleMOQ === 'number' && product.wholesaleMOQ > 0)
        ? product.wholesaleMOQ
        : 1

    // ── B. Wholesale order qualification (MOQ check) ─────────────────────────
    const meetsMOQ = quantity >= moq

    // ── Resolve retail pricing ────────────────────────────────────────────────
    // retailRegularPrice is the primary price post-Phase 1.
    // Fall back to legacy `price` if retailRegularPrice is somehow not set
    // (handles any products that pre-date the Phase 1 migration).
    const retailRegular = product.retailRegularPrice ?? product.price ?? 0

    // retailSalePrice is valid only when it exists AND is strictly less than regular
    const retailSaleValid =
        typeof product.retailSalePrice === 'number' &&
        product.retailSalePrice > 0 &&
        product.retailSalePrice < retailRegular

    const retailEffective = retailSaleValid ? product.retailSalePrice : retailRegular

    // ── Resolve wholesale pricing ─────────────────────────────────────────────
    const wholesaleRegular = wholesaleAvailable ? product.wholesaleRegularPrice : null

    const wholesaleSaleValid =
        wholesaleAvailable &&
        typeof product.wholesaleSalePrice === 'number' &&
        product.wholesaleSalePrice > 0 &&
        product.wholesaleSalePrice < wholesaleRegular

    const wholesaleEffective = wholesaleAvailable
        ? (wholesaleSaleValid ? product.wholesaleSalePrice : wholesaleRegular)
        : null

    // ── Decision: which tier to apply ────────────────────────────────────────
    // For DISPLAY purposes (product listing, product detail):
    //   Wholesale pricing applies when eligible + product has wholesale pricing.
    //   meetsMOQ is informational — it does NOT gate the displayed price tier.
    //
    // For CART/ORDER enforcement:
    //   Pass actual quantity and check meetsMOQ separately to block checkout.
    //   This keeps display and enforcement cleanly separated.
    const applyWholesale = eligible && wholesaleAvailable

    if (applyWholesale) {
        return {
            customerType:         customerCtx.customerType,
            pricingType:          'wholesale',
            isWholesaleEligible:  true,
            isWholesaleAvailable: true,
            meetsMOQ:             true,
            regularPrice:         wholesaleRegular,
            salePrice:            wholesaleSaleValid ? product.wholesaleSalePrice : null,
            effectivePrice:       wholesaleEffective,
            wholesaleMOQ:         moq
        }
    }

    // ── Retail / fallback result ──────────────────────────────────────────────
    return {
        customerType:         customerCtx.customerType,
        pricingType:          'retail',
        isWholesaleEligible:  eligible,
        isWholesaleAvailable: wholesaleAvailable,
        meetsMOQ:             eligible ? meetsMOQ : true,  // retail users always "meet" MOQ
        regularPrice:         retailRegular,
        salePrice:            retailSaleValid ? product.retailSalePrice : null,
        effectivePrice:       retailEffective,
        wholesaleMOQ:         wholesaleAvailable ? moq : null
    }
}

/**
 * Attach pricing result to a plain product object for API responses.
 * Strips wholesale pricing fields from the object when the customer is not eligible,
 * preventing wholesale data from leaking to unauthorized users.
 *
 * @param {object} productObj   - Plain product object (from .lean() or .toObject())
 * @param {object} customerCtx  - Customer context from buildCustomerContext()
 * @param {number} [quantity=1]
 * @returns {object}            - Product object with `pricing` key injected
 */
export const attachPricing = (productObj, customerCtx, quantity = 1) => {
    const pricing = getEffectivePrice(productObj, customerCtx, quantity)

    // Strip wholesale fields from the response for non-eligible users
    // so wholesale prices never leak over the network
    const safe = { ...productObj }
    if (!isWholesaleEligible(customerCtx)) {
        delete safe.wholesaleRegularPrice
        delete safe.wholesaleSalePrice
        delete safe.wholesaleMOQ
    }

    return { ...safe, pricing }
}
