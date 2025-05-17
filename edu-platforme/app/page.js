"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Check, Lightbulb, Lightning, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PricingCards from "@/components/landing/PricingCard";
import Testimonials from "@/components/landing/Testimonials";
import Features from "@/components/landing/Features";

export default function Home() {
  const { isSignedIn } = useUser();
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Study Smarter with <span className="text-primary">AI-Powered</span> Learning
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-md">
                Generate personalized study materials, flashcards, quizzes, and notes with the power of AI to master any topic.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {isSignedIn ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="px-8 py-6 text-lg">
                      Go to Dashboard <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/sign-up">
                    <Button size="lg" className="px-8 py-6 text-lg">
                      Get Started Free <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-6 text-lg"
                  onClick={() => setShowPricing(true)}
                >
                  View Pricing
                </Button>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <Check className="h-4 w-4 text-primary mr-2" />
                No credit card required
                <span className="mx-2">•</span>
                <Check className="h-4 w-4 text-primary mr-2" />
                Get started in minutes
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
                  <Image 
                    src="/dashboard-preview.png" 
                    width={600} 
                    height={400} 
                    alt="Dashboard Preview" 
                    className="rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-20 px-6 md:px-20 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Students & Educators Choose EducLydIA
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Supercharge your learning with AI-generated study materials tailored to your needs.
            </p>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Personalized Learning</h3>
                <p className="mt-2 text-gray-600">
                  Create custom study materials tailored to your specific needs and learning style.
                </p>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                </div>
                <h3 className="text-xl font-semibold">Save Time</h3>
                <p className="mt-2 text-gray-600">
                  Generate comprehensive study materials in seconds, not hours or days.
                </p>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Master Any Topic</h3>
                <p className="mt-2 text-gray-600">
                  From coding to history, create materials for any subject at any difficulty level.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <Features />

        {/* How It Works */}
        <section className="py-20 px-6 md:px-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                How EducLydIA Works
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Create comprehensive study materials in just a few clicks
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
                <h3 className="text-xl font-semibold">Select Your Purpose</h3>
                <p className="mt-2 text-gray-600">
                  Choose whether you're studying for an exam, job interview, practice, or coding.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
                <h3 className="text-xl font-semibold">Enter Your Topic</h3>
                <p className="mt-2 text-gray-600">
                  Input the subject matter and select your preferred difficulty level.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
                <h3 className="text-xl font-semibold">Get Your Materials</h3>
                <p className="mt-2 text-gray-600">
                  Our AI generates comprehensive course outlines, notes, flashcards, and quizzes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Pricing */}
        <section id="pricing" className="py-20 px-6 md:px-20 bg-white">
          <PricingCards />
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-20 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of students and educators who are already using EducLydIA to create personalized study materials.
            </p>
            <div className="mt-10">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg text-primary">
                    Go to Dashboard <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg text-primary">
                    Get Started Free <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}