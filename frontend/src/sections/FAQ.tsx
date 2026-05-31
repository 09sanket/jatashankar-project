"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      value: "item-1",
      question: "Are the healthcare courses accredited?",
      answer:
        "Yes. All degree programs and professional certifications at Jatashankar Institute are fully accredited by the Council on Medical Education and Health Certifications. Our curricula are designed to align with licensing board requirements.",
    },
    {
      value: "item-2",
      question: "How do virtual and physical simulation labs work?",
      answer:
        "Students participate in weekly practical lab sessions. We utilize advanced medical telemetry manikins, simulated ICU wards, and VR software to let students practice clinical diagnostics, patient care, and emergency protocols in a safe environment.",
    },
    {
      value: "item-3",
      question: "What are the admission requirements for the Nursing program?",
      answer:
        "Applicants must have completed secondary school with strong marks in biological sciences, chemistry, and mathematics. Standardized entrance exams and a brief personal clinical readiness interview are also required.",
    },
    {
      value: "item-4",
      question: "Are clinical rotations included in the tuition fee?",
      answer:
        "Yes, clinical rotations at our 50+ affiliated teaching hospitals are fully integrated into the program fee structures. There are no additional placement fees for students undergoing standard hospital rotations.",
    },
    {
      value: "item-5",
      question: "Is financial aid or scholarship support available?",
      answer:
        "Jatashankar offers merit-based and need-based scholarships covering up to 60% of tuition costs. Our advisors can help you structure payment plans and apply for financial assistance during the inquiry phase.",
    },
  ];

  return (
    <section id="faq" className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-slate-950 border-t border-brand-cream-350 dark:border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-red-500">
              Common Inquiries
            </span>
            <h2 className="font-serif font-extrabold text-3xl text-brand-dark dark:text-white tracking-tight title-accent-bar-center">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-6">
              Find answers regarding admissions, simulation lab access, tuition payment plans, and accreditation.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="rounded-large border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/40 dark:bg-slate-900 p-6 md:p-8 shadow-premium">
            <Accordion className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.value} value={faq.value} className="border-b last:border-b-0 border-brand-cream-350 dark:border-slate-800/60 py-1">
                  <AccordionTrigger className="text-left font-serif font-bold text-sm sm:text-base text-brand-dark hover:text-brand-red-500 dark:text-slate-200 dark:hover:text-brand-gold-500 hover:no-underline transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
