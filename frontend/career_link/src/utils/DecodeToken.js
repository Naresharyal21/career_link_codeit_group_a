export const decodeToken = (token) => {
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(normalized);

        return JSON.parse(decoded);
    } catch (err) {
        console.error("Failed to decode token:", err);
        return null;
    }
};