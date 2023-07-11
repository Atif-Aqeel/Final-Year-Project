import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import axios from "helpers/axios";
import FieldHeader from "components/ui/FieldHeader";
import * as validate from "helpers/formValidation";
import fieldChangeHandler from "helpers/fieldChangeHandler";
import getClasses from "helpers/getClasses";
import Loading from "components/ui/Loading";
import Checkbox from "../../../components/core/input/Checkbox";

const AssignSubject = () => {
  const formikRef = useRef();
  const initState = {
    className: "",
    teacherName: "",
  };

  const [backendErrors, setBackendErrors] = useState({});
  const [formFeedback, setFormFeedback] = useState({});
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getClasses();
      if (data.message === "success") {
        setClasses(data.classes);
        if (formikRef.current && data.classes[0]) {
          formikRef.current.setFieldValue("className", data.classes[0]._id);
        }
      } else {
        setFormFeedback({
          type: "error",
          msg: data.data.message || data.statusText,
        });
      }
      setLoading(false);
      getSubjects();
    })();
  }, []);

  const getSubjects = () => {
    setLoading(true);
    axios
      .get("/subject/all")
      .then((r) => {
        const data = r.data;
        if (data.message !== "success") {
          setFeedback("error", data.message);
          return;
        }
        setSubjects(data.subjects);
        const selectedClass = formikRef.current.getFieldMeta("className").value;
        if (selectedClass) getClassTeachers(selectedClass);
      })
      .catch((error) => {
        const data = error.response.data;
        setFeedback("error", data.message || error.response.statusText);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const getClassTeachers = (classID) => {
    setLoading(true);
    axios
      .get(`/getClassTeachers?teacherClass=${classID}`)
      .then((r) => {
        const data = r.data;
        if (data.message !== "success") {
          setFeedback("error", data.message);
          return;
        }

        setTeachers(data.teachers);
        if (data.teachers.length > 0) {
          formikRef.current.setFieldValue("teacherName", data.teachers[0]._id);
          getClassTeacherSubjects(data.teachers[0]._id, classID);
        }
      })
      .catch((error) => {
        const data = error.response.data;
        setFeedback("error", data.message || error.response.statusText);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const getClassTeacherSubjects = (teacherID, classID) => {
    setLoadingSubjects(true);
    axios
      .get(
        `/subject/classTeacherSubjects?teacherID=${teacherID}&classID=${classID}`
      )
      .then((r) => {
        const data = r.data;
        if (data.message !== "success") {
          setFeedback("error", data.message);
          return;
        }

        const teacherSubjects = [...data.subjects];
        const subs = subjects.map((subject) => {
          const sub = teacherSubjects.find(
            (ele) => ele.subject === subject._id
          );
          return {
            ...subject,
            selected: !!sub,
          };
        });
        console.log({subs})
        // setSubjects(subs);
      })
      .catch((error) => {
        const data = error.response.data;
        setFeedback("error", data.message || error.response.statusText);
      })
      .then(() => {
        setLoadingSubjects(false);
      });
  };

  const submitForm = (values, { setSubmitting }) => {
    setFormFeedback({});
    const selectedSubjects = subjects
      .filter((sub) => sub.selected)
      .map((sub) => sub._id);
    if (!selectedSubjects.length) return;

    axios
      .post("/subject/assign", {
        subjects: selectedSubjects,
        classID: values.className,
        teacherID: values.teacherName,
      })
      .then((r) => {
        const data = r.data;
        if (data.message !== "success") {
          setFeedback("error", data.message);
        }
      })
      .catch((error) => {
        const data = error.response.data;
        setFeedback("error", data.message || error.response.statusText);
      })
      .then(() => {
        setSubmitting(false);
      });
  };

  const toggleSubject = (subjectID) => {
    const subs = subjects.map((subjectItem) => {
      if (subjectItem._id === subjectID) {
        return {
          ...subjectItem,
          selected: !subjectItem.selected,
        };
      }
      return subjectItem;
    });
    setSubjects(subs);
  };

  console.log({ subjects });

  const setFeedback = (type = "error", message = "Server Error") => {
    setFormFeedback({
      type,
      msg: message,
    });
  };

  return (
    <>
      <Formik
        initialValues={initState}
        onSubmit={submitForm}
        innerRef={formikRef}
      >
        {({ isSubmitting, errors, touched, handleChange, values }) => (
          <Form className="dashboard__form formMd">
            <div className="dashboard__form__header">
              <h3 className="dashboard__form__header__title">
                Assign Subject(s)
              </h3>
            </div>
            {formFeedback.msg && (
              <h3 className={"formFeedback " + formFeedback.type}>
                {formFeedback.msg}
              </h3>
            )}
            <div className="flex w-full items-center justify-center flex-column">
              <div className="formGroup">
                <FieldHeader
                  header="Select Class"
                  name="className"
                  error={errors.className}
                  backendError={backendErrors.className}
                  touched={touched.className}
                />
                <Field
                  as="select"
                  name="className"
                  id="className"
                  validate={(value) =>
                    validate.minLength(value, "Class Name", 1)
                  }
                  onChange={(e) => {
                    getClassTeachers(e.target.value);
                    fieldChangeHandler(
                      e,
                      handleChange,
                      backendErrors,
                      setBackendErrors
                    );
                  }}
                >
                  {classes.map((ele) => (
                    <option key={ele._id} value={ele._id}>
                      {ele.name}
                    </option>
                  ))}
                </Field>
              </div>
              {!isLoading &&
                (teachers.length > 0 ? (
                  <div className="formGroup">
                    <FieldHeader
                      header="Select Teacher"
                      name="teacherName"
                      error={errors.teacherName}
                      backendError={backendErrors.teacherName}
                      touched={touched.teacherName}
                    />
                    <Field
                      as="select"
                      name="teacherName"
                      id="teacherName"
                      validate={(value) =>
                        validate.minLength(value, "Teacher Name", 1)
                      }
                      onChange={(e) => {
                        getClassTeacherSubjects(
                          e.target.value,
                          values.className
                        );
                        fieldChangeHandler(
                          e,
                          handleChange,
                          backendErrors,
                          setBackendErrors
                        );
                      }}
                    >
                      {teachers.map((ele) => (
                        <option key={ele._id} value={ele._id}>
                          {ele.firstName + " " + ele.lastName}
                        </option>
                      ))}
                    </Field>
                  </div>
                ) : (
                  <p className="formGroup text-2xl text-red-500 text-center">
                    No Teacher Found for this Class!
                  </p>
                ))}
              <div className="formGroup items-start">
                {subjects?.map((sub) => (
                  <Checkbox
                    key={sub._id}
                    id={sub._id}
                    name={sub.name}
                    checked={sub?.selected}
                    toggleCheck={toggleSubject}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn--primary"
              >
                Set Subject(s)
              </button>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

const TableItem = (props) => {
  return (
    <div className="tableItem">
      <div className="w-20">{props.index + 1}</div>
      <div className="w-20">{props.name}</div>
      <div className="w-20">{props.about}</div>
      <div className="w-20">{props.meta}</div>
      <div className="w-20 btnItem">
        <Link to={props.goto} className="btn btn--tertiary btn--sm">
          View
        </Link>
      </div>
    </div>
  );
};

export default AssignSubject;
