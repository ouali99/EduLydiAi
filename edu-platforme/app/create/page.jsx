'use client'
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button'
import TopicInput from './_components/TopicInput'
import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Create = () => {
  const [step, setStep] =  useState(0)
  const [formData, setFormData] = useState([])
  const {user} = useUser()
  const [loading, setLoading] = useState(false) 
  const router = useRouter()


  const handelUserInput = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
    console.log(formData)
  }

  /**
   * Used to save user input and generate IA course 
   */
  const GenerateCourseOutline = async() => {
    const courseId = uuidv4()
    setLoading(true)
    const result = await axios.post('/api/generate-course-outline', {
      courseId : courseId,
      ...formData,
      createdBy: user?.primaryEmailAddress?.emailAddress
    });
    setLoading(false)
    router.replace('/dashboard')
    //Toeast notification
    toast('Your course is generating, please wait')
    console.log(result);
  }
  return (
    <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20'> 
      <h2 className='font-bold text-4xl text-primary'>Start Building Your Personal Study Material</h2>
      <p className='text-gray-500 text-lg'>Fill All details in order to create your study material for you</p>

      <div className='mt-10'>
        {step == 0 ? <SelectOption selectedStudyType={(value) => handelUserInput('courseType', value)} />
        : <TopicInput 
        setTopic={(value) => handelUserInput('topic', value)} 
        setDifficultyLevel={(value) => handelUserInput('difficultyLevel', value)}
        />}
      </div>

      <div className='flex justify-between w-full mt-32'>
        {step != 0 ? <Button variant='outline' onClick={() => setStep(step - 1)}>Previous</Button>: " "}
        {step == 0 ? <Button onClick={() => setStep(step + 1)}>Next</Button> 
        : <Button onClick={GenerateCourseOutline}>Generate</Button>}
      </div>
    </div>
  )
}

export default Create