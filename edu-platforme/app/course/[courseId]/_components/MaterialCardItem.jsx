import { Button } from '@/components/ui/button'
import axios from 'axios'
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner';

function MaterialCardItem({item, studyTypeContent, course, refreshData}) {
  const [loading, setLoading] = useState(false);
  const [localContent, setLocalContent] = useState(null);
  
  // Utiliser soit le contenu local, soit le contenu des props
  const effectiveContent = localContent || studyTypeContent;
  const isContentReady = effectiveContent && effectiveContent[item.type] && effectiveContent[item.type].length !== null;
  
  // Effect pour forcer une actualisation lors du montage du composant
  useEffect(() => {
    // Appeler refreshData pour s'assurer que les données sont à jour
    refreshData();
  }, []);
  
  const GenerateContent = async () => {
    // Vérifier si courseId existe
    if (!course?.courseId) {
      toast.error('Course ID is missing!');
      return;
    }

    toast('Generating content... please wait');
    setLoading(true);
    let chapters = '';
    course?.courseLayout.chapters.forEach((chapter) => {
        chapters = chapter.chapter_title + ',' + chapters;
    });

    try {
      const result = await axios.post('/api/study-type-content', {
        courseId: course.courseId,
        type: item.type,
        chapters: chapters
      });

      console.log("Génération démarrée:", result.data);
      
      // Forcer la mise à jour locale immédiatement pour changer l'UI
      const tempContent = {...(effectiveContent || {})};
      if (!tempContent[item.type]) {
        tempContent[item.type] = { length: 1 }; // Une valeur non-null pour passer la condition
      }
      setLocalContent(tempContent);
      
      // Rafraîchir les données depuis l'API
      refreshData();
      
      setLoading(false);
      toast('Your content is ready to view');
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      toast.error('An error occurred while generating content');
    }
  }
  
  return (
    <div className={`border shadow-md rounded-lg p-5 flex flex-col items-center
      ${!isContentReady && 'grayscale'}
    `}>
        {!isContentReady ?
        <h2 className='p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2'>Generate</h2>
        :<h2 className='p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2'>Ready</h2>}

        <Image src={item.icon} alt={item.name} width={50} height={50}/>
        <h2 className='font-medium mt-3'>{item.name}</h2>
        <p className='text-gray-500 txt-sm text-center'>{item.desc}</p>

        {!isContentReady 
        ?<Button className='mt-3 w-full' variant={'outline'} onClick={(e) => {
          e.preventDefault(); // Empêcher la navigation si à l'intérieur d'un lien
          GenerateContent();
        }}>
          {loading && <RefreshCcw className='animate-spin'/>}
          Generate</Button>
        : <Link href={'/course/' + course?.courseId + item.path}>
        <Button className='mt-3 w-full' variant={'outline'}>View</Button>
        </Link>}
    </div>
  )
}

export default MaterialCardItem