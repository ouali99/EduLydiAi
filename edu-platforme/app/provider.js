"use client";
import { db } from '@/configs/db';
import { USER_TABLE } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { eq } from 'drizzle-orm'; // Import de eq
import axios from 'axios';

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    user && CheckIsNewUser();
  }, [user]);

  const CheckIsNewUser = async () => {
    // Vérifie si l'utilisateur existe déjà, sinon l'ajoute à la DB
    // const result = await db
    //   .select()
    //   .from(USER_TABLE)
    //   .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

    //   if (result?.length === 0) {
    //   // Ajouter à la base de données
    //   const userResponse = await db
    //     .insert(USER_TABLE)
    //     .values({
    //       name: user?.fullName,
    //       email: user?.primaryEmailAddress?.emailAddress,
    //     })
    //     .returning({ id: USER_TABLE.id });
    // }
    const reponse = await axios.post('/api/create-user', { user: user });
    console.log(reponse.data);
  };

  return <div>{children}</div>;
}

export default Provider;
