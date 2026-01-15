export const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);
};

export const formatDate = (date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(date));
};

export const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
};
