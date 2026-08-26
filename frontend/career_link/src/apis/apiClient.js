const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = async (endpoint, options = {}) => {
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

    const finalURL = `${BASE_URL}${endpoint}`;

  if (!response.ok) {
    const message=
    data.email?.[0]||
    data.detail||
    data.error||
    "Something went wrong";
    throw new Error(message);
  }

    const response = await fetch(finalURL, {
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

        setError(
            err?.response?.data?.detail ||
                err?.message ||
                "Unable to load reports."
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

    post: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "POST",

            ...(body !== undefined
                ? {
                      body: JSON.stringify(body),
                  }
                : {}),
        }),

    put: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: (endpoint, options = {}) =>
        request(endpoint, {
            ...options,
            method: "DELETE",
        }),
};

export default apiClient;