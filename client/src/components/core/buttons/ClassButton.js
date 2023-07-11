import { Link } from 'react-router-dom'
import React from 'react'

const ClassButton = (props) =>
    <Link
        to={(props.changeClass ? '/dashboard/assignTeacher/' : '/dashboard/classInfo/') + props.id}
        className={`flex justify-center items-center px-6 py-2 rounded-2xl text-white text-2xl hover:no-underline hover:shadow-md transition-all ${props.changeClass ? 'bg-green-500  hover:bg-green-600' : 'bg-blue-400 hover:bg-blue-600'}`}>
        {props.name}
    </Link>

export default ClassButton
