import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import accountsApi from "../../apis/accountsApi";

const Loginform = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await accountsApi.login({
                username: username.trim(),
                password,
            });

            if (!data?.access || !data?.refresh) {
                throw new Error("Login response did not contain valid tokens.");
            }

            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            const destination = location.state?.from || "/moderator";
            navigate(destination, { replace: true });
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            setError(err?.message || "Unable to login. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
            >
                <h1 className="text-2xl font-bold text-gray-900">CareerLink</h1>
                <p className="mt-1 mb-6 text-sm text-gray-500">Sign in to continue</p>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-purple-700"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-purple-700"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-purple-700 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Loginform;
