import React, { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import FieldHeader from "../components/ui/FieldHeader";

import * as validate from "../helpers/formValidation";
import axios from "../helpers/axios";
import fieldChangeHandler from "../helpers/fieldChangeHandler";

import logo from "../assests/img/logo_colors.svg";
import isAuth from "../helpers/isAuth";

const Signup = (props) => {
  const navigate = useNavigate();
  const [backendErrors, setBackendErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const initState = {
    instituteName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    setFormError(null);

    axios
      .post("/signup", {
        ...values,
      })
      .then((r) => {
        const data = r.data;
        if (data.message === "success") {
          localStorage.setItem("cmsToken", data.token);
          localStorage.setItem("cmsUserID", data.userID);
          localStorage.setItem("cmsRole", data.role);
          localStorage.setItem("cmsInstituteID", data.instituteID);
          localStorage.setItem("cmsUserName", data.userName);

          navigate("/dashboard/addClass");
        } else {
          setFormError(data.message);
        }
      })
      .catch((error) => {
        const data = error.response.data;
        const errors = {};

        if (Array.isArray(data.error)) {
          data.error.forEach((err) => {
            setFieldError(err.param, err.msg);
            errors[err.param] = err.msg;
          });

          setBackendErrors({ ...backendErrors, ...errors });
        } else {
          setFormError(data.message);
        }
      })
      .then(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    if (isAuth()) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  return (
    <div className="authPage">
      <div className="authPage__container">
        <h1
          style={{
            fontSize: "30px",
            margin: "10px",
            color: "#d8644f",
            fontWeight: "bold",
          }}
        >
          School Management System
        </h1>
        {/* <img src={logo} alt="" className="authPage__logo" /> */}

        <Formik initialValues={initState} onSubmit={submitForm}>
          {({ isSubmitting, errors, touched, handleChange }) => (
            <Form className="authPage__form">
              {formError ? <h3 className="formErrorMsg">{formError}</h3> : null}
              <div className="formGroup">
                <FieldHeader
                  header="Institute Name"
                  name="instituteName"
                  error={errors.instituteName}
                  backendError={backendErrors.instituteName}
                  touched={touched.instituteName}
                />

                <Field
                  type="instituteName"
                  name="instituteName"
                  id="instituteName"
                  validate={(value) =>
                    validate.minLength(value, "Institute Name", 1)
                  }
                  onChange={(e) =>
                    fieldChangeHandler(
                      e,
                      handleChange,
                      backendErrors,
                      setBackendErrors
                    )
                  }
                />
              </div>
              <div className="formGroup">
                <FieldHeader
                  name="email"
                  error={errors.email}
                  backendError={backendErrors.email}
                  touched={touched.email}
                />

                <Field
                  type="email"
                  name="email"
                  id="email"
                  validate={validate.validateEmail}
                  onChange={(e) =>
                    fieldChangeHandler(
                      e,
                      handleChange,
                      backendErrors,
                      setBackendErrors
                    )
                  }
                />
              </div>
              <div className="formGroup w-50">
                <FieldHeader
                  header="First Name"
                  name="firstName"
                  error={errors.firstName}
                  backendError={backendErrors.firstName}
                  touched={touched.firstName}
                />

                <Field
                  type="firstName"
                  name="firstName"
                  id="firstName"
                  validate={(value) =>
                    validate.minLength(value, "First Name", 1)
                  }
                  onChange={(e) =>
                    fieldChangeHandler(
                      e,
                      handleChange,
                      backendErrors,
                      setBackendErrors
                    )
                  }
                />
              </div>
              <div className="formGroup w-50">
                <FieldHeader
                  header="Last Name"
                  name="lastName"
                  error={errors.lastName}
                  backendError={backendErrors.lastName}
                  touched={touched.lastName}
                />

                <Field
                  type="lastName"
                  name="lastName"
                  id="lastName"
                  validate={(value) =>
                    validate.minLength(value, "Last Name", 1)
                  }
                  onChange={(e) =>
                    fieldChangeHandler(
                      e,
                      handleChange,
                      backendErrors,
                      setBackendErrors
                    )
                  }
                />
              </div>
              <div className="formGroup">
                <FieldHeader
                  name="password"
                  error={errors.password}
                  backendError={backendErrors.password}
                  touched={touched.password}
                />

                <Field
                  type="password"
                  name="password"
                  id="password"
                  validate={(value) => validate.minLength(value, "Password", 6)}
                  onChange={(e) =>
                    fieldChangeHandler(
                      e,
                      handleChange,
                      backendErrors,
                      setBackendErrors
                    )
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn--primary"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
