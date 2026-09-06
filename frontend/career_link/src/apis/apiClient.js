const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");
    const finalURL = `${BASE_URL}${endpoint}`;
    const isFormData = options.body instanceof FormData;

    const response = await fetch(finalURL, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        let message = "Something went wrong.";

        if (typeof data === "object" && data !== null) {
            if (data.detail) {
                message = data.detail;
            } else if (data.message) {
                message = data.message;
            } else {
                message = Object.entries(data)
                    .map(([field, errors]) => {
                        const errorText = Array.isArray(errors)
                            ? errors.join(", ")
                            : String(errors);
                        return `${field}: ${errorText}`;
                    })
                    .join(" | ");
            }
        } else if (data) {
            message = String(data);
        }

        const error = new Error(message);
        error.response = { data, status: response.status };
        throw error;
    }

    return data;
};

const apiClient = {
    get: (endpoint, options = {}) =>
        request(endpoint, { ...options, method: "GET" }),

    post: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "POST",
            ...(body !== undefined
                ? { body: body instanceof FormData ? body : JSON.stringify(body) }
                : {}),
        }),

    put: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    patch: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "PATCH",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    delete: (endpoint, options = {}) =>
        request(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
