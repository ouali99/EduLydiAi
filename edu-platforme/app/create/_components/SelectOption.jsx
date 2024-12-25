import { Icon } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

const SelectOption = ({selectedStudyType}) => {
    const Options = [
        {
            name: 'Exam',
            Icon: '/exam_1.png'
        },
        {
            name: 'Job Interview',
            Icon: '/job.png'
        },
        {
            name: 'Practice',
            Icon: '/practice.png'
        },
        {
            name: 'Coding',
            Icon: '/code.png'
        },
        {
            name: 'Other',
            Icon: '/knowledge.png'
        }
    ]

    const [selectedOption, setSelectedOption] = useState()
  return (
    <div>
        <h2 className='text-center mb-2 text-lg'>For which purpose you want to create study material</h2>
        <div className='grid mt-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
            {Options.map((option, index) => (
                <div key={index} className={`p-4 flex flex-col items-center justify-center border rounded-xl cursor-pointer 
              ${option.name === selectedOption ? 'border-primary' : 'border-transparent'} 
              hover:border-primary`}
                    onClick={() => {setSelectedOption(option.name);selectedStudyType(option.name)}}>
                    <Image src = {option.Icon} alt={option.name} width={50} height={50} />
                    <p className='text-sm mt-2'>{option.name}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SelectOption