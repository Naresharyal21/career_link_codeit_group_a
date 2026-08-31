const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");

    const cleanBase = BASE_URL.replace(/\/+$/, "");
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    const finalURL = `${cleanBase}/${cleanEndpoint}`;

    const isFormData =
        options.body instanceof FormData;

    const headers = {
        ...(isFormData
            ? {}
            : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // If Content-Type was explicitly set to undefined (e.g. for FormData upload), remove it so the browser sets the boundary
    if (headers["Content-Type"] === undefined) {
        delete headers["Content-Type"];
    }

    const response = await fetch(finalURL, {
        ...options,
        headers,
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        console.log("Backend error:", data);

        let message = "Something went wrong.";

        if (typeof data === "object" && data !== null) {
            if (data.detail) {
                message = data.detail;
            } else if (data.message) {
                message = data.message;
            } else if (data.error) {
                message = data.error;
            } else {
                const firstError = Object.values(data)
                    .flat()
                    .find((value) => typeof value === "string");

                if (firstError) {
                    message = firstError;
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

// Callable function: apiClient(endpoint, options)
const apiClient = (endpoint, options = {}) => {
    return request(endpoint, options);
};

// Convenience methods
apiClient.get = (endpoint, options = {}) =>
    request(endpoint, {
        ...options,
        method: "GET",
    });

apiClient.post = (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return request(endpoint, {
        ...options,
        method: "POST",
        body: isFormData || typeof body === "string" || body === undefined
            ? body
            : JSON.stringify(body),
    });
};

apiClient.put = (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return request(endpoint, {
        ...options,
        method: "PUT",
        body: isFormData || typeof body === "string" || body === undefined
            ? body
            : JSON.stringify(body),
    });
};

apiClient.patch = (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return request(endpoint, {
        ...options,
        method: "PATCH",
        body: isFormData || typeof body === "string" || body === undefined
            ? body
            : JSON.stringify(body),
    });
};

apiClient.delete = (endpoint, options = {}) =>
    request(endpoint, {
        ...options,
        method: "DELETE",
    });

export default apiClient;