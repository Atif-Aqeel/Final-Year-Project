const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const InstituteClass = require("../models/InstituteClass");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const checkClassesID = require("../helpers/checkClassesID");
const sendEmail = require("../helpers/sendEmail");

const { CLIENT_URL } = require("../config/keys");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");

const addUser = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    dob,
    gender,
    admissionDate,
    rollNo,
    studentClass,
    staffID,
    joiningDate,
    role,
  } = req.body;

  const userRole = role || "Student";
  const newUser = new User({
    email,
    institute: req.user.instituteID,
    password: "1234",
    firstName,
    lastName,
    dob,
    gender,
    role: userRole,

    admissionDate,
    rollNo,
    class: studentClass,

    staffID,
    joiningDate,
  });
  await newUser.save();

  // Student will have a class by default
  if (userRole === "Student") {
    const cls = await InstituteClass.findById(studentClass.toString()).select(
      "students"
    );
    cls.students.push(newUser._id);
    await cls.save();
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(token, 10);
  const link = `${CLIENT_URL}/set-password?token=${tokenHash}&id=${newUser._id}`;
  await sendEmail(email, "Account Password.", {
    name: `${firstName} ${lastName}`,
    link,
  });

  newUser.passwordSetToken = token;
  await newUser.save();

  res.status(201).json({
    message: "success",
    userID: newUser._id,
  });
};

const getUser = async (req, res) => {
  const { userID } = req.query;

  const user = await User.findById(userID)
    .select("-password -email")
    .populate("institute", "name")
    .populate("classes", "name")
    .populate("class", "name");

  res.status(200).json({
    message: "success",
    user,
  });
};

const getClassStudents = async (req, res, next) => {
  const { studentClass: classID } = req.query;

  const users = await User.find({
    class: classID,
    institute: req.user.instituteID,
    role: "Student",
  })
    .select("firstName lastName rollNo admissionDate")
    .lean();

  res.status(200).json({
    message: "success",
    students: users,
  });
};

const getStudents = async (req, res, next) => {
  const users = await User.find({
    institute: req.user.instituteID,
    role: "Student",
  })
    .select("firstName lastName rollNo admissionDate class")
    .populate("class", "name", "InstituteClass")
    .sort("class.name")
    .lean();

  res.status(200).json({
    message: "success",
    students: users,
  });
};

const updateStudentClass = async (req, res, next) => {
  const { classID, userID } = req.body;

  const student = await User.findById(userID);
  await student.changeStudentClass(classID);

  res.status(200).json({
    message: "success",
  });
};

const getClassTeachers = async (req, res, next) => {
  const { teacherClass: classID } = req.query;

  console.log({ classID });
  const users = await User.find({
    institute: req.user.instituteID,
    classes: { $in: [ObjectId(classID)] },
    role: "Teacher",
  })
    .select("firstName lastName staffID joiningDate")
    .lean();
  res.status(200).json({
    message: "success",
    teachers: users,
  });
};

const getTeachers = async (req, res, next) => {
  const users = await User.aggregate()
    .match({
      institute: mongoose.Types.ObjectId(req.user.instituteID),
      role: "Teacher",
    })
    .project({
      firstName: 1,
      lastName: 1,
      staffID: 1,
      joiningDate: 1,
      classes: { $size: "$classes" },
    });

  res.status(200).json({
    message: "success",
    teachers: users,
  });
};

const getTeachersWithClasses = async (req, res, next) => {
  const { userID } = req.query;
  const filters = {
    institute: mongoose.Types.ObjectId(req.user.instituteID),
    role: "Teacher",
  };
  if (userID) filters._id = userID;

  const users = await User.find(filters)
    .select("firstName lastName staffID classes")
    .lean();

  res.status(200).json({
    message: "success",
    teachers: users,
  });
};

const updateTeacherClasses = async (req, res, next) => {
  const { userID, classes: latestClasses } = req.body;

  const isClassesValid = await checkClassesID([...latestClasses]);
  if (!isClassesValid) {
    const error = new Error("Invalid Class found in Data");
    error.statusCode = 401;
    return next(error);
  }

  const user = await User.findById(userID).select("classes");
  const prevClasses = [...user.classes];

  user.classes = latestClasses;
  await user.save();

  // latest classes = [2,4,5] prev = [1,2]
  const removedClasses = [];
  const newClasses = [];
  prevClasses.forEach((prevClass) => {
    if (latestClasses.indexOf(prevClass) === -1) removedClasses.push(prevClass);
  });
  latestClasses.forEach((latestClass) => {
    if (prevClasses.indexOf(latestClass) === -1) newClasses.push(latestClass);
  });
  for (let i = 0; i < removedClasses.length; i++) {
    const cls = await InstituteClass.findById(removedClasses[i]);
    await cls.removeTeacher(userID);
  }
  for (let i = 0; i < newClasses.length; i++) {
    const cls = await InstituteClass.findById(newClasses[i]);
    await cls.addTeacher(userID);
  }

  res.status(200).json({
    message: "success",
    teachers: user,
  });
};

const markAttendance = async (req, res, next) => {
  // students[{isPresent, _id}]

  const { date, studentClass: classID, students } = req.body;

  const users = await User.find({
    institute: req.user.instituteID,
    class: classID,
    role: "Student",
  })
    .select("_id")
    .lean();

  users.map((ele) => {
    const index = students.findIndex(
      (std) => std._id.toString() === ele._id.toString()
    );

    ele.isPresent = !!students[index]?.isPresent;
    ele.student = ele._id.toString();
    ele.attendanceClass = classID;
    ele.date = date;
    delete ele._id;

    return ele;
  });

  for (let i = 0; i < users.length; i++) {
    const userAttendance = users[i];
    await Attendance.updateOne(
      {
        date: new Date(date).toISOString(),
        student: userAttendance.student,
        attendanceClass: userAttendance.attendanceClass,
      },
      userAttendance,
      { upsert: true }
    );
  }

  res.status(201).json({
    message: "success",
  });
};

const getAttendance = async (req, res, next) => {
  const { date, studentClass: classID } = req.query;

  const attendances = await Attendance.find({
    institute: req.user.instituteID,
    class: classID,
    date: new Date(date).toISOString(),
  })
    .select("isPresent student")
    .populate("student", "firstName lastName rollNo,");

  res.status(200).json({
    message: "success",
    studentsAttendance: attendances,
  });
};

const getInitialAttendance = async (req, res, next) => {
  const { date, studentClass: classID } = req.query;

  console.log(req.query, req.user.instituteID);

  const users = await User.find({
    institute: req.user.instituteID,
    class: classID,
    role: "Student",
  })
    .select("firstName lastName rollNo")
    .lean();

  console.log(users);

  const studentsAttendance = await Attendance.find({
    attendanceClass: classID,
    date: new Date(date).toISOString(),
  })
    .select("isPresent student")
    .lean();

  users.map((user) => {
    const index = studentsAttendance.findIndex(
      (attendance) => attendance.student.toString() === user._id.toString()
    );
    user.isPresent = !!studentsAttendance[index]?.isPresent;
    return user;
  });

  res.status(200).json({
    message: "success",
    initialAttendance: users,
  });
};

module.exports = {
  addUser: asyncHandler(addUser),
  getUser: asyncHandler(getUser),
  getClassStudents: asyncHandler(getClassStudents),
  getStudents: asyncHandler(getStudents),
  updateStudentClass: asyncHandler(updateStudentClass),
  getClassTeachers: asyncHandler(getClassTeachers),
  getTeachers: asyncHandler(getTeachers),
  getTeachersWithClasses: asyncHandler(getTeachersWithClasses),
  updateTeacherClasses: asyncHandler(updateTeacherClasses),
  markAttendance: asyncHandler(markAttendance),
  getAttendance: asyncHandler(getAttendance),
  getInitialAttendance: asyncHandler(getInitialAttendance),
};
