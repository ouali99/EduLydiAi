import React, { useEffect, useState } from 'react'
import MaterialCardItem from './MaterialCardItem'
import axios from 'axios'
import Link from 'next/link';

function StudyMaterialSection({courseId, course}) {
    const [studyTypeContent, setStudyTypeContent] = useState();
    const MaterialList = [
        {
            name: 'Notes/Chapters',
            desc: 'Read notes of each chapter',
            icon: '/notes.png',
            path: '/notes',
            type: 'notes'
        },
        {
            name: 'Flashcards',
            desc: 'Flashcards of each chapter',
            icon: '/flashcard.png',
            path: '/flashcards',
            type: 'flashcards'
        },
        {
            name: 'Quiz',
            desc: 'Great way to test your knowledge',
            icon: '/quiz.png',
            path: '/quiz',
            type: 'quiz'
        },
        {
            name: 'Questions/Answers',
            desc: 'Help you to get a clear idea of the topic',
            icon: '/qa.png',
            path: '/qa',
            type: 'qa'     
        }
    ]

    useEffect(() => {
        GetStudyMaterial();
    }, [courseId])

    const GetStudyMaterial= async() => {
        const result = await axios.post('/api/study-type',{
            courseId: courseId,
            studyType: 'ALL'
        });
        console.log(result?.data);
        setStudyTypeContent(result?.data);
    }
  return (
    <div className='mt-5'>
        <h2 className='font-medium text-xl'>Study Material</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-3'>
            {MaterialList.map((item, index) => (
                
                <MaterialCardItem item={item} key={index}
                    studyTypeContent={studyTypeContent}
                    course={course}
                    refreshData={GetStudyMaterial}
                />
                
            ))}
        </div>
    </div>
  )
}

export default StudyMaterialSection