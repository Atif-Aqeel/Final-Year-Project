import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ClassButton from 'components/core/buttons/ClassButton'
import Loading from 'components/ui/Loading'
import getClasses from 'helpers/getClasses'
import Checkbox from 'components/core/input/Checkbox'
import axios from 'helpers/axios'

const UserDetails = (props) => {
  const params = useParams()

  const [user, setUser] = useState({})
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [showClasses, setShowClasses] = useState(false)
  const [isClassesLoading, setIsClassesLoading] = useState(false)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = () => {
    setLoading(true)

    axios.get('/getUser', { params: { userID: params.id } })
      .then(r => {
        if (r?.data?.message === 'success') { setUser(r.data.user) }
      })
      .catch(error => {
        const data = error.response.data
        setError(data.message || error.response.statusText || 'Server Error')
      })
      .then(() => {
        setLoading(false)
      })
  }

  const getClassesData = async () => {
    setShowClasses(true)
    setIsClassesLoading(true)
    if (user.role !== 'Student') return
    const data = await getClasses()
    if (data.message === 'success') {
      const classesData = data.classes
      classesData.map(ele => {
        return ele
      })
      setClasses(classesData)
    } else {
      setError(data.data.message || data.statusText || 'Server Error')
    }
    setIsClassesLoading(false)
  }

  const toggleUserClass = (classID) => {
    const userTemp = { ...user }
    userTemp.class = classes.find(cls => cls._id === classID)
    setUser(userTemp)
  }

  const saveStudentClass = () => {
    setIsClassesLoading(true)
    axios.post('/updateStudentClass', { userID: user._id, classID: user.class._id })
      .then(r => {
        setShowClasses(false)
      })
      .catch(error => {
        const data = error.response.data
        setError(data.message || error.response.statusText || 'Server Error')
        setShowClasses(true)
      })
      .then(() => {
        setIsClassesLoading(false)
      })
  }

  if (isLoading) return <Loading/>
  if (error) return <h2 className="text-4xl text-red-600 w-full text-center">{error}</h2>
  if (!user && !user.role) return null
  return (
        <div className="w-full max-w-full flex flex-column mx-auto justify-center items-center pt-5 gap-5">
            <div className="flex justify-center items-center gap-3 mb-3">
                <h1 className="text-5xl bold">{user.firstName + ' ' + user.lastName} - </h1>
                <h2 className="text-4xl underline">{user.role}</h2>
            </div>
            <div className="max-w-4xl w-full flex flex-column gap-5">
                <DetailItem label="Institute:" value={user?.institute?.name}/>
                <DetailItem label="Joining Date:" value={user?.joiningDate}/>
                <DetailItem label="Admission Date:" value={user?.admissionDate}/>
                <DetailItem label="Staff ID:" value={user?.staffID}/>
                <DetailItem label="Roll Number:" value={user?.rollNo}/>
                <DetailItem label="Date of Birth:" value={user.dob ? new Date(user?.dob).toLocaleDateString() : null}/>
                <DetailItem label="Gender:" value={user?.gender}/>
                {
                    user.classes && user.role === 'Teacher' &&
                    <div className="flex justify-between items-start gap-5 ">
                        <h2 className="text-4xl">Classes:</h2>
                        <div className="w-full flex justify-start items-center gap-3 flex-wrap">
                            {
                                user?.classes?.map(cls => <ClassButton key={cls._id} name={cls.name} id={cls._id}/>
                                )
                            }
                            <ClassButton name="Update Classes" changeClass id={user._id}/>
                        </div>
                    </div>
                }
                {
                    user.class && user.role === 'Student' &&
                    <div className="flex justify-between items-center gap-5 ">
                        <h2 className="text-4xl">Class:</h2>
                        {
                            !showClasses &&
                            <div className="flex gap-5">
                                <ClassButton name={user.class.name} id={user.class._id}/>
                                <button
                                    onClick={getClassesData}
                                    className={'flex justify-center items-center px-6 py-2 rounded-2xl text-white text-2xl hover:no-underline hover:shadow-md transition-all bg-green-500  hover:bg-green-600 active:text-white focus:text-white'}>
                                    Update Class
                                </button>
                            </div>
                        }
                    </div>
                }
            </div>
            {
                showClasses && <div className="max-w-4xl w-full flex flex-column flex-start gap-4">
                    {isClassesLoading && <Loading/>}
                    {
                        !isClassesLoading && classes?.map(classItem =>
                            <Checkbox
                                key={classItem._id}
                                id={classItem._id}
                                name={classItem.name}
                                checked={user.class._id === classItem._id}
                                toggleCheck={toggleUserClass}
                            />)
                    }
                    {!isClassesLoading &&
                        <button type="submit" className='btn btn--primary' onClick={saveStudentClass}>
                            Save Student
                        </button>
                    }
                </div>
            }
        </div>
  )
}

const DetailItem = (props) => props.value
  ? (<div className="flex justify-between items-center gap-3">
        <h2 className="text-4xl">{props.label}</h2>
        <h2 className='text-4xl bold'>{props.value}</h2>
    </div>)
  : null

export default UserDetails
