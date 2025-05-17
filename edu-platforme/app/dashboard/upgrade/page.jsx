"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UpgradePage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const plans = [
    {
      id: "price_free",
      name: "Free",
      description: "Perfect for trying out EducLydIA",
      price: 0,
      credits: 5,
      features: [
        "5 AI-generated courses",
        "Basic content types (Notes, Flashcards)",
        "Standard AI quality",
        "1 difficulty level",
        "Community support"
      ],
      highlight: false,
      current: true
    },
    {
      id: isAnnual ? "price_pro_annual" : "price_pro_monthly",
      name: "Pro",
      description: "For serious students and educators",
      price: isAnnual ? 9.99 : 14.99,
      credits: "Unlimited",
      features: [
        "Unlimited AI-generated courses",
        "All content types (Notes, Flashcards, Quizzes, Q&A)",
        "Enhanced AI quality",
        "All difficulty levels",
        "Priority support",
        "Export to PDF",
        "Dark mode"
      ],
      highlight: true,
      current: false
    },
    {
      id: isAnnual ? "price_teams_annual" : "price_teams_monthly",
      name: "Teams",
      description: "For educational institutions",
      price: isAnnual ? 19.99 : 24.99,
      credits: "Unlimited",
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
      highlight: false,
      current: false
    }
  ];

  const handleSubscription = async (priceId) => {
    if (priceId === "price_free") {
      toast.info("You are already on the Free plan");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/create-checkout-session", {
        priceId,
        email: user?.primaryEmailAddress?.emailAddress
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSales = () => {
    router.push("/contact");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-10">
        <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
        <p className="text-gray-500 mt-2">
          Choose the perfect plan for your learning journey
        </p>

        <div className="mt-6 flex items-center space-x-3 bg-gray-100 p-1 rounded-lg">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl overflow-hidden border ${
              plan.highlight
                ? "border-primary/50 shadow-lg shadow-primary/10"
                : "border-gray-200"
            } ${plan.current ? "border-green-500 border-2" : ""}`}
          >
            {plan.current && (
              <div className="bg-green-500 text-white text-center py-1 text-sm font-medium">
                Current Plan
              </div>
            )}
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

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Credits:</span>{" "}
                  <span className="text-primary font-bold">{plan.credits}</span>{" "}
                  courses per month
                </p>
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
                {plan.name === "Teams" ? (
                  <Button
                    variant={plan.highlight ? "default" : "outline"}
                    className="w-full"
                    size="lg"
                    onClick={handleContactSales}
                    disabled={loading}
                  >
                    Contact Sales
                  </Button>
                ) : plan.current ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.highlight ? "default" : "outline"}
                    className="w-full"
                    size="lg"
                    onClick={() => handleSubscription(plan.id)}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Subscribe Now"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>
          All plans include a 14-day money-back guarantee. No contracts, cancel
          anytime.
        </p>
        <p className="mt-2">
          Need a custom plan for your organization?{" "}
          <button
            onClick={handleContactSales}
            className="text-primary hover:underline"
          >
            Contact our sales team
          </button>
        </p>
      </div>
    </div>
  );
}