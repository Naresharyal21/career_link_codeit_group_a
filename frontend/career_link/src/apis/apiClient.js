const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");

    // Strip any trailing slash off BASE_URL and any leading slash
    // off endpoint before joining with exactly one "/" — avoids
    // double slashes (e.g. BASE_URL="…/api/v1/" + endpoint="/accounts/login/")
    // regardless of whether either side happens to already have one.
    const finalURL = `${BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(
        /^\/+/,
        ""
    )}`;

    console.log("API REQUEST:", {
        BASE_URL,
        endpoint,
        finalURL,
        hasToken: !!token,
    });

    const response = await fetch(finalURL, {
        ...options,
        headers: {
            ...(options.body instanceof FormData
                ? {}
                : { "Content-Type": "application/json" }),

            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),

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

        throw new Error(message);
    }

    return data;
};

// Callable function
const apiClient = (endpoint, options = {}) => {
    return request(endpoint, options);
};

// Convenience methods
apiClient.get = (endpoint, options = {}) =>
    request(endpoint, {
        ...options,
        method: "GET",
    });

apiClient.post = (endpoint, body, options = {}) =>
    request(endpoint, {
        ...options,
        method: "POST",
        ...(body !== undefined
            ? {
                  body: JSON.stringify(body),
              }
            : {}),
    });

apiClient.put = (endpoint, body, options = {}) =>
    request(endpoint, {
        ...options,
        method: "PUT",
        ...(body !== undefined
            ? {
                  body: JSON.stringify(body),
              }
            : {}),
    });

apiClient.patch = (endpoint, body, options = {}) =>
    request(endpoint, {
        ...options,
        method: "PATCH",
        ...(body !== undefined
            ? {
                  body: JSON.stringify(body),
              }
            : {}),
    });

apiClient.delete = (endpoint, options = {}) =>
    request(endpoint, {
        ...options,
        method: "DELETE",
    });

export default apiClient;