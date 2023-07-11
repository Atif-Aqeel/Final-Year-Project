import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import isAuth from 'helpers/isAuth'
import Sidebar from 'components/sidebar/Sidebar'

import AddClass from 'containers/dashboard/instituteClass/AddClass'
import Classes from 'containers/dashboard/instituteClass/Classes'
import ClassInfo from 'containers/dashboard/instituteClass/ClassInfo'

import AddSubject from 'containers/dashboard/subject/AddSubject'
import Subjects from 'containers/dashboard/subject/Subjects'
import SubjectDetails from 'containers/dashboard/subject/SubjectDetails'
import AssignSubject from 'containers/dashboard/subject/AssignSubject'

import AddStudent from 'containers/dashboard/student/AddStudent'
import StudentsList from 'containers/dashboard/student/StudentsList'

import AddTeacher from 'containers/dashboard/teacher/AddTeacher'
import TeachersList from 'containers/dashboard/teacher/TeachersList'
import AssignTeachers from 'containers/dashboard/teacher/AssignTeachers'

import Attendance from 'containers/dashboard/attendance/Attendance'

import UserDetails from 'containers/dashboard/user/UserDetails'

const Dashboard = (props) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuth()) {
      navigate('/login', { replace: true })
    } else if (location.pathname === '/dashboard') {
      navigate('/dashboard/addClass', { replace: true })
    }
  }, [])

  return (
        <div className='dashboard'>
            <Sidebar/>
            <div className="dashboard__container">
                <Routes>
                    <Route path='/addClass' element={<AddClass/>}/>
                    <Route path='/classes' element={<Classes/>}/>
                    <Route path='/classInfo/:id' element={<ClassInfo/>}/>
                    <Route path='/classInfo' element={<ClassInfo/>}/>
                    <Route path='/assignStudents' element={<AddTeacher/>}/>

                    <Route path='/addSubject' element={<AddSubject/>}/>
                    <Route path='/subjects' element={<Subjects/>}/>
                    <Route path='/subjects/:id' element={<SubjectDetails/>}/>

                    <Route path='/addStudent' element={<AddStudent/>}/>
                    <Route path='/students' element={<StudentsList/>}/>
                    <Route path='/students/:id' element={<UserDetails/>}/>
                    <Route path='/assignSubject' element={<AssignSubject/>}/>

                    <Route path='/addTeacher' element={<AddTeacher/>}/>
                    <Route path='/assignTeacher' element={<AssignTeachers/>}/>
                    <Route path='/assignTeacher/:id' element={<AssignTeachers/>}/>
                    <Route path='/teachers' element={<TeachersList/>}/>
                    <Route path='/teachers/:id' element={<UserDetails/>}/>

                    <Route path='/markAttendance' element={<Attendance/>}/>
                    <Route path='/checkAttendance' element={<Attendance isStatic={true}/>}/>
                </Routes>

            </div>

        </div>

  )
}

export default Dashboard
