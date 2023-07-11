import React, { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";

import logo from "assests/img/logo_colors.svg";
import axios from "helpers/axios";

import FieldHeader from "components/ui/FieldHeader";
import * as validate from "helpers/formValidation";
import fieldChangeHandler from "helpers/fieldChangeHandler";
import isAuth from "helpers/isAuth";
// import { urlencoded } from "express";

const initState = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [backendErrors, setBackendErrors] = useState({});
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (isAuth()) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const submitForm = (values, { setSubmitting, setFieldError }) => {
    setFormError(null);

    axios
      .post("/login", {
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
          navigate("/dashboard/classes");
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
        <Formik initialValues={initState} onSubmit={submitForm}>
          {({ isSubmitting, errors, touched, handleChange }) => (
            <Form className="authPage__form">
              {formError ? <h3 className="formErrorMsg">{formError}</h3> : null}
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
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
