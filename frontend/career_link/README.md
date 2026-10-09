# CareerLink frontend

## Development

Install dependencies with `npm install`, configure the environment variables in
`.env.example`, then run `npm run dev`.

## Auth0 social sign-in

Set `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` in the frontend `.env` file.
Set the same Auth0 domain and client ID in
`Backend/career_link_project/career_link_project/.env` as `AUTH0_DOMAIN` and
`AUTH0_CLIENT_ID`. Install the backend requirements and run Django migrations.

In the Auth0 application settings, add the frontend origin (for example,
`http://localhost:5173/auth/callback`) to **Allowed Callback URLs**. Add
`http://localhost:5173` to **Allowed Logout URLs** and **Allowed Web Origins**.
Enable the Google social connection in Auth0 and turn it on for this application.

Users select either Jobseeker or Employer before sign-in. New users finish the
existing role-specific profile fields before their CareerLink account is
created. Existing accounts keep their original role; signing in with a different
role is rejected.
