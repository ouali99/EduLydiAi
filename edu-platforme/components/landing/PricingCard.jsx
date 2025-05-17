"use client";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(true);
  const { isSignedIn } = useUser();

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out EducLydIA",
      price: isAnnual ? 0 : 0,
      features: [
        "5 AI-generated courses",
        "Basic content types (Notes, Flashcards)",
        "Standard AI quality",
        "1 difficulty level",
        "Community support"
      ],
      action: isSignedIn ? "dashboard" : "sign-up",
      highlight: false
    },
    {
      name: "Pro",
      description: "For serious students and educators",
      price: isAnnual ? 9.99 : 14.99,
      features: [
        "Unlimited AI-generated courses",
        "All content types (Notes, Flashcards, Quizzes, Q&A)",
        "Enhanced AI quality",
        "All difficulty levels",
        "Priority support",
        "Export to PDF",
        "Dark mode"
      ],
      action: isSignedIn ? "dashboard/upgrade" : "sign-up",
      highlight: true
    },
    {
      name: "Teams",
      description: "For educational institutions",
      price: isAnnual ? 19.99 : 24.99,
      features: [
        "Everything in Pro",
        "Team member management",
        "Collaborative study materials",
        "Analytics dashboard",
        "Dedicated account manager",
        "API access",
        "Custom branding options",
        "SSO authentication"
      ],
      action: "contact",
      highlight: false
    }
  ];

  return (
    <div id="pricing" className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your learning journey
        </p>
        
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-3 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isAnnual
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="ml-1 text-xs text-green-500 font-normal">
                Save 20%
              </span>
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                !isAnnual
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl overflow-hidden border ${
              plan.highlight
                ? "border-primary/50 shadow-lg shadow-primary/10"
                : "border-gray-200"
            }`}
          >
            <div className="p-8">
              <h3 className="font-bold text-2xl text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600 ml-2">
                  /{isAnnual ? "year" : "month"}
                </span>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.action === "contact" ? (
                  <Link href="/contact">
                    <Button
                      variant={plan.highlight ? "default" : "outline"}
                      className="w-full"
                      size="lg"
                    >
                      Contact Sales
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/${plan.action}`}>
                    <Button
                      variant={plan.highlight ? "default" : "outline"}
                      className="w-full"
                      size="lg"
                    >
                      {plan.price === 0 ? "Get Started" : "Subscribe Now"}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>
          All plans include a 14-day money-back guarantee. No contracts, cancel anytime.
        </p>
      </div>
    </div>
  );
}