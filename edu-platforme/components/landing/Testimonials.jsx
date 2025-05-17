import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "EducLydIA completely transformed how I study for exams. The AI-generated flashcards and quizzes helped me ace my biochemistry finals!",
      author: "Sarah K.",
      role: "Medical Student",
      avatar: "/testimonial-1.png"
    },
    {
      quote: "As a teacher, I use EducLydIA to create supplementary materials for my classes. It saves me hours of work each week, and my students love the interactive content.",
      author: "Michael T.",
      role: "High School Teacher",
      avatar: "/testimonial-2.png"
    },
    {
      quote: "The job interview prep materials were fantastic. I studied using the AI-generated Q&As for a technical interview and got the job at a top tech company!",
      author: "Priya M.",
      role: "Software Engineer",
      avatar: "/testimonial-3.png"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-6 md:px-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied students and educators
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src={testimonial.avatar}
                    width={48}
                    height={48}
                    alt={testimonial.author}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}