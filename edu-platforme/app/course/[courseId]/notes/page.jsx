"use client"
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function ViewNotes() {
    const {courseId} = useParams();
    const[notes, setNotes] = useState();
    const [stepCount, setStepCount] = useState(0);
    const route = useRouter();

    useEffect(() => {
        GetNotes();
    }, [])

    const GetNotes = async () => {
        const result = await axios.post('/api/study-type',{
            courseId: courseId,
            studyType: 'notes'
        });
        console.log(result?.data);
        setNotes(result?.data || []);
    }

    const displayNotes = (notes) => {
        if (!notes) {
            return null; 
        }
        if (typeof notes === "object") return notes.content || notes;

        try {
            const parsed = JSON.parse(notes);
            return parsed.content || parsed;
        } catch (e) {
            console.error("Error parsing notes:", e);
            return notes; // Retourne les notes brutes si le parsing échoue
        }
    }

  return notes&&(
    <div className="mt-10 container mx-auto px-4 max-w-3xl"> 
        <div className='flex justify-between gap-5 items-center'>
            {stepCount!=0&& <Button variant={'outline'} size={'sm'} onClick={() => setStepCount(stepCount-1)}>Previous</Button>}
            {notes?.map((item, index) => (
                <div key={index} className={`w-full h-2 rounded-full
                ${index<stepCount? 'bg-primary' : 'bg-gray-200'}`}>
                </div>
            ))}
            {stepCount < notes?.length&&<Button variant={'outline'} size={'sm'} onClick={() => setStepCount(stepCount+1)}>next</Button>}
        </div>
        <style jsx global>{`
                .notes-content h3 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1a365d;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 0.5rem;
                }
                .notes-content h4 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .notes-content p {
                    color: #4a5568;
                    line-height: 1.7;
                    margin-bottom: 1rem;
                }
                .notes-content code {
                    background-color: #edf2f7;
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.25rem;
                    font-family: monospace;
                }
            `}</style>
        <div className="notes-content bg-white p-6 rounded-lg shadow-lg">
            <div dangerouslySetInnerHTML={{__html: displayNotes(notes[stepCount]?.notes)}}/>
            {notes?.length == stepCount && <div className='flex flex-col gap-5 items-center'>
                    <h2>End of Notes</h2>
                    <Button onClick={() => route.back()}>Go to course page</Button>
                </div>}
        </div>
    </div>
  )
}

export default ViewNotes