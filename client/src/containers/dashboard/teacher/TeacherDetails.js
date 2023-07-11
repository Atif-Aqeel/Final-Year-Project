import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ClassButton from 'components/core/buttons/ClassButton'
import Loading from 'components/ui/Loading'
import axios from 'helpers/axios'

const TeacherDetails = (props) => {
  const params = useParams()

  const [teacher, setTeacher] = useState({})
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    getTeacher()
  }, [])

  const getTeacher = () => {
    console.log(params)
    setLoading(true)

    axios.get('/getUser', { params: { userID: params.id } })
      .then(r => {
        if (r?.data?.message === 'success') {
          setTeacher(r.data.user)
        }
      })
      .catch(error => {
        const data = error.response.data
        setError(data.message || error.response.statusText || 'Server Error')
      })
      .then(() => {
        setLoading(false)
      })
  }

  if (isLoading) return <Loading />
  if (error) return <h2 className="text-4xl text-red-600 w-full text-center">{error}</h2>
  if (!teacher && !teacher.role) return null
  return (
        <div className="w-full max-w-full flex flex-column mx-auto justify-center items-center pt-5 gap-5">
            <div className="flex justify-center items-center gap-3 mb-3">
                <h1 className="text-5xl bold">{teacher.firstName + ' ' + teacher.lastName} - </h1>
                <h2 className="text-4xl underline">{teacher.role}</h2>
            </div>
            <div className="max-w-4xl w-full flex flex-column gap-5">
                <div className="flex justify-between items-center gap-3">
                    <h2 className="text-4xl">Institute:</h2>
                    <h2 className='text-4xl bold'>{teacher?.institute?.name}</h2>
                </div>
                <div className="flex justify-between items-center gap-3">
                    <h2 className="text-4xl">Joining Date:</h2>
                    <h2 className='text-4xl bold'>{teacher?.joiningDate}</h2>
                </div>
                <div className="flex justify-between items-center gap-3">
                    <h2 className="text-4xl">Staff ID:</h2>
                    <h2 className='text-4xl bold'>{teacher?.staffID}</h2>
                </div>
                <div className="flex justify-between items-center gap-3">
                    <h2 className="text-4xl">Date of Birth:</h2>
                    <h2 className='text-4xl bold'>{new Date(teacher?.dob).toLocaleDateString()}</h2>
                </div>
                <div className="flex justify-between items-center gap-3">
                    <h2 className="text-4xl">Gender:</h2>
                    <h2 className='text-4xl bold'>{teacher?.Gender}</h2>
                </div>
                <div className="flex justify-between items-start gap-5 ">
                    <h2 className="text-4xl">Classes:</h2>
                    <div className="w-full flex justify-start items-center gap-3">
                        {
                            teacher?.classes?.map(cls => <ClassButton key={cls._id} name={cls.name} id={cls._id}/>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
  )
}

export default TeacherDetails
