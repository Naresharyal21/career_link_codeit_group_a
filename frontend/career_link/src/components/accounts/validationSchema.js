import * as Yup from "yup";

export const usernameRule = Yup.string()
  .required("This field is required")
  .min(3, "Must be at least 3 characters");

export const emailRule = Yup.string()
  .email("Enter a valid email")
  .required("Email is required");

export const passwordRule = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .required("Password is required");

export const locationRule = Yup.string().required("Location is required");

export const loginValidationSchema = Yup.object({
  email: emailRule,
  password: passwordRule,
});

export const signupValidationSchema = Yup.object({
  username: usernameRule,
  email: emailRule,
  password: passwordRule,
  role: Yup.string()
    .oneOf(["js", "ep"], "Invalid role")
    .required("Role is required"),
  location: locationRule,

  // Jobseeker Phone conditional
  phone: Yup.string().when("role", {
    is: "js",
    then: (schema) => schema.required("Phone number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Jobseeker Date of Birth conditional
  date_of_birth: Yup.date()
    .nullable()
    .when("role", {
      is: "js",
      then: (schema) =>
        schema
          .max(
            new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
            "You must be at least 18 years old",
          )
          .required("Date of birth is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  // Employer Website conditional
  website: Yup.string().when("role", {
    is: "ep",
    then: (schema) => schema.url("Enter a valid website URL").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),

  company_description: Yup.string().max(450, "Must be within 450 characters"),
});
