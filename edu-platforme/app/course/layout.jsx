import React from 'react'
import DashboardHeader from '../dashboard/_components/DashboardHeader'
import SideBar from '../dashboard/_components/SideBar'

function CourseViewLayout({children}) {
  return (
    <div>
        <DashboardHeader />
        <div>
            {children}
        </div>
    </div>
  )
}

export default CourseViewLayout