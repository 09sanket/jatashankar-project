"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle, GraduationCap } from "lucide-react";
import { slideUp } from "../animations/transitions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CTA() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", program: "B.Sc. Clinical Nursing" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessOpen(true);
  };

  const handleClose = () => {
    setIsSuccessOpen(false);
    setFormData({ name: "", email: "", phone: "", program: "B.Sc. Clinical Nursing" });
  };

  return (
    <section id="admissions" className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-slate-900 border-t border-brand-cream-350 dark:border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-red-500">
                Admissions Now Open
              </span>
              <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight leading-tight title-accent-bar">
                Start Your Journey in Professional Healthcare
              </h2>
              <p className="font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed mt-6">
                Join an elite institution where medical science meets practical expertise. We review applications on a rolling basis for Fall and Spring semesters.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3.5">
              {[
                "Accredited B.Sc. and Professional Certificate programs",
                "Full-time clinical rotations at partner hospitals",
                "Scholarships and financial support programs",
                "Flexible classroom learning and virtual sim components"
              ].map((text, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm text-slate-650 dark:text-slate-350">
                  <CheckCircle className="w-5 h-5 text-brand-red-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Call Center */}
            <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-large bg-brand-cream-50 dark:bg-slate-950 border border-brand-cream-350 dark:border-slate-850">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-brand-red-500/10 flex items-center justify-center text-brand-red-500 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Admissions Help</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">Talk with an Advisor</p>
                </div>
              </div>
              <div className="sm:border-l border-brand-cream-350 dark:border-slate-800 sm:pl-6 flex items-center">
                <a 
                  href="tel:+91225558932" 
                  className="font-mono text-base font-bold text-brand-red-500 hover:underline animate-pulse"
                >
                  +91 22 555-8932
                </a>
              </div>
            </div>
          </div>

          {/* Form Side / Application Card */}
          <div id="apply" className="lg:col-span-6">
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8 md:p-10 rounded-large border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/40 dark:bg-slate-950/40 shadow-premium overflow-hidden relative"
            >
              <h3 className="font-serif font-extrabold text-2xl text-brand-dark dark:text-white mb-2">
                Request Program Details
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Submit this quick form to schedule an academic counseling session and receive details on curriculums and scholarships.
              </p>

              {/* Form elements */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-brand-cream-350 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-500/20 focus:border-brand-red-500 dark:text-slate-200 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-brand-cream-350 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-500/20 focus:border-brand-red-500 dark:text-slate-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 99999-99999"
                      className="w-full px-4 py-3 rounded-xl border border-brand-cream-350 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-500/20 focus:border-brand-red-500 dark:text-slate-200 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Program of Interest</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brand-cream-350 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-500/20 focus:border-brand-red-500 dark:text-slate-200 transition-colors"
                  >
                    <option>B.Sc. Clinical Nursing</option>
                    <option>Advanced Clinical Pharmacology</option>
                    <option>Emergency Medical Services (EMS)</option>
                    <option>Human Anatomy & Physiology</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 btn-academic-primary text-xs uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all mt-4"
                >
                  <span>Submit Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-md p-6 bg-brand-cream-50 dark:bg-slate-950 border border-brand-cream-350 dark:border-slate-850">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-red-500/10 flex items-center justify-center text-brand-red-500 mx-auto">
              <GraduationCap className="w-6 h-6 text-brand-red-500" />
            </div>
            <DialogTitle className="text-center font-serif font-extrabold text-xl text-brand-dark dark:text-white">
              Inquiry Submitted
            </DialogTitle>
            <DialogDescription className="text-center text-slate-655 text-slate-500 dark:text-slate-400 text-sm">
              Thank you, <span className="font-semibold text-brand-red-500">{formData.name}</span>. We have received your request for the <span className="font-semibold text-brand-dark dark:text-white">{formData.program}</span> program. An admissions advisor will contact you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex sm:justify-center">
            <Button
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 font-bold text-xs uppercase tracking-wider text-white btn-academic-primary"
            >
              Okay, Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
