import { useContext, useEffect, useRef, useState } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";

import accountsApi from "../../apis/accountsApi";
import { AuthenticationContext } from "../../context/AuthContext";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const isConfigured = Boolean(domain && clientId);

const ProviderButtons = ({ role, callbackOnly }) => {
  const { isAuthenticated, isLoading, error, getIdTokenClaims, loginWithRedirect } = useAuth0();
  const { loginUser, setUser } = useContext(AuthenticationContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isExchangingToken, setIsExchangingToken] = useState(false);
  const [flowError, setFlowError] = useState("");
  const exchangeStarted = useRef(false);

  useEffect(() => {
    if (!callbackOnly || !isAuthenticated || exchangeStarted.current) return;
    exchangeStarted.current = true;

    const finishLogin = async () => {
      setIsExchangingToken(true);
      try {
        const idToken = (await getIdTokenClaims())?.__raw;
        const selectedRole = sessionStorage.getItem("careerlink_auth0_role");
        if (!idToken || !selectedRole) {
          throw new Error("Your social sign-in session is incomplete. Please try again.");
        }

        const response = await accountsApi.auth0Login(idToken, selectedRole);
        if (response.profile_required) {
          navigate("/signup", {
            replace: true,
            state: {
              auth0Onboarding: {
                idToken,
                email: response.email,
                username: response.username,
                role: response.role,
              },
            },
          });
          return;
        }

        loginUser(response.access, response.refresh);
        const user = await accountsApi.getMe();
        setUser(user);
        sessionStorage.removeItem("careerlink_auth0_role");
        const returnPath =
          sessionStorage.getItem("careerlink_auth0_return_path") ||
          location.state?.from ||
          "/dashboard";
        sessionStorage.removeItem("careerlink_auth0_return_path");
        toast.success("Login successful!");
        navigate(returnPath, { replace: true });
      } catch (exchangeError) {
        exchangeStarted.current = false;
        setFlowError(exchangeError.message || "Could not complete social sign-in.");
        sessionStorage.removeItem("careerlink_auth0_role");
        sessionStorage.removeItem("careerlink_auth0_return_path");
      } finally {
        setIsExchangingToken(false);
      }
    };

    finishLogin();
  }, [
    getIdTokenClaims,
    isAuthenticated,
    location.state,
    loginUser,
    navigate,
    setUser,
    callbackOnly,
  ]);

  const startLogin = async (connection) => {
    sessionStorage.setItem("careerlink_auth0_role", role);
    if (location.state?.from) {
      sessionStorage.setItem("careerlink_auth0_return_path", location.state.from);
    }

    try {
      await loginWithRedirect({
        authorizationParams: {
          connection,
          prompt: "select_account",
        },
      });
    } catch (loginError) {
      sessionStorage.removeItem("careerlink_auth0_role");
      sessionStorage.removeItem("careerlink_auth0_return_path");
      toast.error(loginError.message || "Could not start social sign-in.");
    }
  };

  const disabled = isLoading || isExchangingToken;

  if (callbackOnly) {
    const message = flowError || error?.message;
    const hasNoSession = !isLoading && !isAuthenticated && !message;

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          {message || hasNoSession ? (
            <>
              <h1 className="text-xl font-bold text-slate-900">
                {message ? "Sign-in could not be completed" : "No active sign-in"}
              </h1>
              <p role="alert" className="mt-3 text-sm text-slate-600">
                {message || "Start signing in from the login page and try again."}
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Return to login
              </Link>
            </>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-700"
              />
              <h1 className="mt-5 text-xl font-bold text-slate-900">Signing you in</h1>
              <p role="status" className="mt-2 text-sm text-slate-600">
                {isLoading || isAuthenticated || isExchangingToken
                  ? "Please wait while we securely finish your sign-in."
                  : "Preparing your secure sign-in…"}
              </p>
            </>
          )}
        </section>
      </main>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => startLogin("google-oauth2")}
        className="auth0-provider-button flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
      >
        <FaGoogle aria-hidden="true" className="text-base text-red-500" />
        Continue with Google
      </button>
      {error && (
        <p role="status" className="text-center text-xs text-slate-500">
          {error.message}
        </p>
      )}
    </div>
  );
};

const Auth0LoginButtons = ({ role, callbackOnly = false }) => {
  if (!isConfigured) {
    if (callbackOnly) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
            <h1 className="text-xl font-bold text-slate-900">Sign-in is not configured</h1>
            <p className="mt-3 text-sm text-slate-600">
              Auth0 settings are missing from the frontend environment.
            </p>
            <Link to="/login" className="mt-6 inline-flex text-sm font-semibold text-violet-700 hover:text-violet-900">
              Return to login
            </Link>
          </section>
        </main>
      );
    }

    return (
      <div className="mt-5 space-y-3">
        <button
          type="button"
          disabled
          className="auth0-provider-button w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400"
        >
          Continue with Google
        </button>
        <p className="text-center text-xs text-slate-500">
          Social sign-in is not configured. Add the Auth0 domain and client ID to the frontend environment.
        </p>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: `${window.location.origin}/auth/callback` }}
    >
      <ProviderButtons role={role} callbackOnly={callbackOnly} />
    </Auth0Provider>
  );
};

export default Auth0LoginButtons;
