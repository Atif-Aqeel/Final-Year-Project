import React from 'react'

import SidebarItem from './SidebarItem'

const dashboardRoutes = [
  {
    name: 'Class',
    options: [
      {
        name: 'Add Class',
        route: 'addClass',
        roles: ['Admin']
      },
      {
        name: 'Classes',
        route: 'classes'
      },

      {
        name: 'Class Information',
        route: 'classInfo'
      }
    ]
  },
  {
    name: 'Subject',
    options: [
      {
        name: 'Add Subject',
        route: 'addSubject',
        roles: ['Admin']
      },
      {
        name: 'Subjects',
        route: 'subjects'
      },
      {
        name: 'Assign Subject',
        route: 'assignSubject',
        roles: ['Admin']
      }
    ]
  },
  {
    name: 'Student',
    options: [
      {
        name: 'Add Student',
        route: 'addStudent',
        roles: ['Admin']
      },
      {
        name: 'Students',
        route: 'students',
        roles: ['Admin', 'Teacher']
      }
    ]
  },
  {
    name: 'Teacher',
    options: [
      {
        name: 'Add Teacher',
        route: 'addTeacher',
        roles: ['Admin']
      },
      {
        name: 'Teachers',
        route: 'teachers',
        roles: ['Admin', 'Teacher']
      },
      {
        name: 'Assign Teacher',
        route: 'assignTeacher',
        roles: ['Admin']
      }
    ]
  },
  {
    name: 'Attendance',
    options: [
      {
        name: 'Mark Attendance',
        route: 'markAttendance',
        roles: ['Admin', 'Teacher']
      },
      {
        name: 'Check Attendance',
        route: 'checkAttendance'
      }
    ]
  }
]

const Sidebar = () => {
  const userRole = localStorage.getItem('cmsRole')

  const shouldDisplayCategory = (catg) => {
    let shouldShow = false
    catg.options.forEach(item => {
      if (item.roles) {
        if (item.roles.includes(userRole)) shouldShow = true
      } else {
        shouldShow = true
      }
    })
    return shouldShow
  }

  return (
        <div className='sidebar'>
            {
                dashboardRoutes.map((ele, index) => {
                  if (!shouldDisplayCategory(ele)) return null
                  return (<SidebarItem
                          key={index}
                          item={ele}
                      />)
                }
                )
            }

        </div>
  )
}

export default Sidebar
