"use client";
import { db } from '@/configs/db';
import { USER_TABLE } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { eq } from 'drizzle-orm';
import axios from 'axios';

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    user && CheckIsNewUser();
  }, [user]);

  const CheckIsNewUser = async () => {
    try {
      // Formatage correct des données utilisateur
      const userData = {
        fullName: user?.fullName,
        primaryEmailAddress: user?.primaryEmailAddress?.emailAddress,
        clerkId: user?.id, // Ajout du clerkId
        imageUrl: user?.imageUrl
      };

      console.log('Sending user data:', userData); // Pour débugger

      const response = await axios.post('/api/create-user', { 
        user: userData 
      });
      
      console.log('User creation response:', response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      // Afficher l'erreur mais ne pas planter l'app
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  };

  return <div>{children}</div>;
}

export default Provider;