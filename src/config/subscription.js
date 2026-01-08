export const SUBSCRIPTION_PLANS = {
    FREE: {
        id: "FREE",
        planType: "free",
        priceId: null,
        name: "Free Plan",
    },
    BASIC: {
        id: "BASIC",
        planType: "basic",
        priceId: import.meta.env.VITE_STRIPE_PRICE_BASIC,
        name: "Basic",
    },
    PRO: {
        id: "PRO",
        planType: "pro",
        priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
        name: "Pro",
    },
    PRO_PLUS: {
        id: "PRO_PLUS",
        planType: "pro_plus",
        priceId: import.meta.env.VITE_STRIPE_PRICE_PRO_PLUS,
        name: "Pro Plus",
    },
    TOP_UP: {
        id: "TOP_UP",
        planType: "top_up",
        priceId: import.meta.env.VITE_STRIPE_PRICE_TOP_UP,
        name: "Top-Up",
    },
};
