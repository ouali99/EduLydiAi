import { BookOpen, BookText, BrainCircuit, ListChecks, FlaskConical, MessageSquare, FileText } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Custom Course Outlines",
      description:
        "Generate comprehensive study plans tailored to your specific topic and learning goals."
    },
    {
      icon: FileText,
      title: "Detailed Chapter Notes",
      description:
        "Get in-depth notes for each chapter, complete with examples and explanations."
    },
    {
      icon: BookText,
      title: "Flashcards",
      description:
        "Create interactive flashcards that help reinforce key concepts through active recall."
    },
    {
      icon: ListChecks,
      title: "Quizzes & Assessments",
      description:
        "Test your knowledge with AI-generated quizzes that adapt to your learning progress."
    },
    {
      icon: MessageSquare,
      title: "Q&A Practice",
      description:
        "Prepare for interviews and exams with practice questions and model answers."
    },
    {
      icon: BrainCircuit,
      title: "Multiple Learning Styles",
      description:
        "Materials support different learning approaches: visual, textual, and interactive."
    }
  ];

  return (
    <section id="features" className="py-20 px-6 md:px-20 bg-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to excel in your learning journey
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}