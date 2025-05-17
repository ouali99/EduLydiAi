"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Download, FileText, BookOpen } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseStats, setCourseStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchSubscriptionData();
      fetchCourseStats();
    }
  }, [isLoaded, user]);

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

  const fetchCourseStats = async () => {
    try {
      // This would be a new API endpoint that calculates course statistics
      // For now, we'll simulate some data
      setCourseStats({
        total: 12,
        completed: 7,
        inProgress: 5
      });
    } catch (error) {
      console.error("Error fetching course stats:", error);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await axios.post('/api/create-portal-session');
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error opening billing portal:", error);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <img
                src={user?.imageUrl}
                alt={user?.fullName || "User"}
                className="h-16 w-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Button 
                variant="outline" 
                className="w-full mb-2"
                onClick={() => window.location.href = '/user/profile'}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              Subscription Details
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Current Plan</p>
                <p className="font-medium text-lg">
                  {subscriptionData?.plan || "Free"}
                </p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <div className="flex items-center">
                  <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                    subscriptionData?.status === "active" ? "bg-green-500" : 
                    subscriptionData?.status === "trialing" ? "bg-blue-500" : 
                    "bg-gray-500"
                  }`}></span>
                  <p className="font-medium capitalize">
                    {subscriptionData?.status || "Active"}
                  </p>
                </div>
              </div>
              
              {subscriptionData?.subscription && (
                <>
                  <div>
                    <p className="text-gray-500 text-sm">Renewal Date</p>
                    <p className="font-medium">
                      {format(new Date(subscriptionData.subscription.currentPeriodEnd), "MMMM d, yyyy")}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm">Renewal Status</p>
                    <p className="font-medium">
                      {subscriptionData.subscription.cancelAtPeriodEnd 
                        ? "Cancels on renewal date" 
                        : "Will renew automatically"
                      }
                    </p>
                  </div>
                </>
              )}
              
              <div className="col-span-2 mt-2">
                {subscriptionData?.plan === "Free" ? (
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = '/dashboard/upgrade'}
                  >
                    Upgrade Now
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleManageBilling}
                  >
                    Manage Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Study Progress
            </h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-primary">{courseStats.total}</p>
                <p className="text-gray-600">Total Courses</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{courseStats.completed}</p>
                <p className="text-gray-600">Completed</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-yellow-600">{courseStats.inProgress}</p>
                <p className="text-gray-600">In Progress</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/dashboard'}
            >
              <FileText className="h-4 w-4 mr-2" />
              View All Courses
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-10">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates about your courses and account</p>
            </div>
            {/* This would be a toggle component in a real app */}
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="font-medium">Download Your Data</p>
              <p className="text-sm text-gray-500">Get a copy of all your study materials</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}