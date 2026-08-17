const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
        `${BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                ...(token
                    ? {
                          Authorization: `Bearer ${token}`,
                      }
                    : {}),

                ...options.headers,
            },
        }
    );

    const contentType =
        response.headers.get("content-type");

    const data = contentType?.includes(
        "application/json"
    )
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        throw new Error(
            typeof data === "object"
                ? data?.detail ||
                      data?.message ||
                      "Something went wrong."
                : data ||
                      "Something went wrong."
        );
    }

    return data;
};

const apiClient = {
    get: (endpoint, options = {}) =>
        request(endpoint, {
            ...options,
            method: "GET",
        }),

    post: (
        endpoint,
        body,
        options = {}
    ) =>
        request(endpoint, {
            ...options,
            method: "POST",

            ...(body !== undefined
                ? {
                      body: JSON.stringify(body),
                  }
                : {}),
        }),

    put: (
        endpoint,
        body,
        options = {}
    ) =>
        request(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: (
        endpoint,
        options = {}
    ) =>
        request(endpoint, {
            ...options,
            method: "DELETE",
        }),
};

export default apiClient;