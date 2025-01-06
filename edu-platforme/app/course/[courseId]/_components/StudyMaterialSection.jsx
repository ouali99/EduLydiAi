import React from 'react'
import MaterialCardItem from './MaterialCardItem'

function StudyMaterialSection() {
    const MaterialList = [
        {
            name: 'Notes/Chapters',
            desc: 'Read notes of each chapter',
            icon: '/notes.png',
            path: '/notes'
        },
        {
            name: 'Flashcards',
            desc: 'Flashcards of each chapter',
            icon: '/flashcard.png',
            path: '/flashcards'
        },
        {
            name: 'Quiz',
            desc: 'Great way to test your knowledge',
            icon: '/quiz.png',
            path: '/quiz'
        },
        {
            name: 'Questions/Answers',
            desc: 'Help you to get a clear idea of the topic',
            icon: '/qa.png',
            path: '/qa'
        }
    ]
  return (
    <div className='mt-5'>
        <h2 className='font-medium text-xl'>Study Material</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-3'>
            {MaterialList.map((item, index) => (
                <MaterialCardItem item={item} key={index}/>
            ))}
        </div>
    </div>
  )
}

export default StudyMaterialSection