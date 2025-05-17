"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Shield, UserCircle, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useUser, SignOutButton } from '@clerk/nextjs'
import axios from 'axios'

const SideBar = () => {
    const MenuList = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard'
        },
        {
           name : 'Upgrade',
           icon: Shield,
           path: '/dashboard/upgrade'
        },
        {
           name : 'Profile',
           icon: UserCircle,
           path: '/dashboard/profile'
        },
    ]

    const path = usePathname();
    const { user } = useUser();
    const [subscriptionData, setSubscriptionData] = useState({
        plan: 'Free',
        credits: 5,
        creditsUsed: 0,
        status: 'active'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchSubscriptionData();
        }
    }, [user]);

    const fetchSubscriptionData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/subscription');
            setSubscriptionData(response.data);
        } catch (error) {
            console.error("Error fetching subscription data:", error);
        } finally {
            setLoading(false);
        }
    };

    const creditsPercentage = Math.min(
        Math.round((subscriptionData.creditsUsed / subscriptionData.credits) * 100),
        100
    );

    const isUnlimited = subscriptionData.credits > 9999;
    
    return (
        <div className='h-screen shadow-md p-5'>
            <div className='flex gap-2 items-center'>
                <Image src={'/EDULydIA.svg'} alt='logo' width={40} height={40} />
                <h2 className='font-bold text-2xl'>EducLydIA</h2>
            </div>

            <div className='mt-10'>
                <Link href={'/create'} className='w-full'>
                <Button className='w-full'>+ Create New</Button>
                </Link>

                <div className='mt-5'>
                    {MenuList.map((menu, index) => (
                        <Link href={menu.path} key={index}>
                            <div className={`flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3 ${path === menu.path && 'bg-slate-200'}`}>
                                <menu.icon />
                                <h2>{menu.name}</h2>
                                {menu.name === 'Upgrade' && subscriptionData.plan === 'Free' && (
                                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full ml-auto">
                                        PRO
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                    <SignOutButton>
                        <div className='flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3 text-red-500'>
                            <LogOut />
                            <h2>Sign Out</h2>
                        </div>
                    </SignOutButton>
                </div>
            </div>

            <div className='border p-3 bg-slate-100 rounded-lg absolute bottom-10 w-[88%]'>
                <div className="flex justify-between items-center">
                    <h2 className='text-lg mb-2'>
                        {isUnlimited ? "Unlimited Credits" : `Available Credits: ${subscriptionData.credits - subscriptionData.creditsUsed}`}
                    </h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        subscriptionData.plan === 'Free' ? 'bg-gray-500 text-white' : 
                        subscriptionData.plan === 'Pro' ? 'bg-primary text-white' :
                        'bg-purple-500 text-white'
                    }`}>
                        {subscriptionData.plan}
                    </span>
                </div>
                
                {!isUnlimited && (
                    <>
                        <Progress value={creditsPercentage} />
                        <h2 className='text-sm'>{subscriptionData.creditsUsed} out of {subscriptionData.credits} Credits Used</h2>
                    </>
                )}

                {subscriptionData.plan === 'Free' && (
                    <Link href={'/dashboard/upgrade'} className='text-primary text-sm mt-3 block'>
                        Upgrade to get unlimited credits
                    </Link>
                )}

                {subscriptionData.plan !== 'Free' && (
                    <Button 
                        variant="link" 
                        className='text-primary text-sm mt-3 p-0 h-auto'
                        onClick={async () => {
                            try {
                                const response = await axios.post('/api/create-portal-session');
                                window.location.href = response.data.url;
                            } catch (error) {
                                console.error("Error opening billing portal:", error);
                            }
                        }}
                    >
                        Manage subscription
                    </Button>
                )}
            </div>
        </div>
    )
}

export default SideBar