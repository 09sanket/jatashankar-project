"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Phone, Globe, Clock, User, Mail, GraduationCap, MessageSquare, Send, CheckCircle2, Star, Sparkles
} from "lucide-react";
import { slideUp, staggerContainer } from "../animations/transitions";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "BPT",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setFormSubmitted(true);
  };

  const contactInfos = [
    {
      title: "Address",
      content: "Jatashankar Group of Institute, Near Devi Talab, Itwari Ganj, Mahaveer Colony, Chitragupt Nagar, Balaghat, Madhya Pradesh 481001",
      icon: <MapPin className="w-5.5 h-5.5 text-[#9B111E]" />,
      link: "https://maps.app.goo.gl/JVnGF1bndnHRoQxv6",
      isLink: true
    },
    {
      title: "Call Us",
      content: "099265 61016\n9575804021",
      icon: <Phone className="w-5.5 h-5.5 text-[#D4A017]" />,
      link: "tel:09926561016",
      isLink: true,
      subLink: "tel:9575804021"
    },
    {
      title: "Website",
      content: "www.jatashankargroup.in",
      icon: <Globe className="w-5.5 h-5.5 text-[#9B111E]" />,
      link: "https://www.jatashankargroup.in",
      isLink: true
    },
    {
      title: "Working Hours",
      content: "Monday - Saturday\n9:00 AM - 5:00 PM",
      icon: <Clock className="w-5.5 h-5.5 text-[#D4A017]" />,
      isLink: false
    }
  ];

  return (
    <section 
      id="contact" 
      className="relative py-20 lg:py-28 overflow-hidden bg-white text-slate-800 border-b border-brand-cream-350 dark:bg-slate-950 dark:border-slate-900"
    >
      {/* Background Gradients & Accents */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-[#FFF8F2] blur-3xl pointer-events-none -z-10 dark:bg-amber-950/5" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-950/5" />

      {/* Decorative background dot pattern */}
      <div className="absolute left-10 top-10 opacity-[0.015] bg-[radial-gradient(#9B111E_1px,transparent_1px)] [background-size:18px_18px] w-48 h-48 rounded-full pointer-events-none -z-20" />
      <div className="absolute right-10 bottom-1/3 opacity-[0.015] bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:18px_18px] w-48 h-48 rounded-full pointer-events-none -z-20" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-16">
        
        {/* ===================================================
            HEADER AREA
            =================================================== */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-block relative">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#9B111E] uppercase block">
              CONTACT US
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#D4A017] rounded-full" />
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white pt-2 leading-tight">
            हमसे संपर्क करें
          </h2>
          <div className="flex items-center justify-center space-x-2 pt-1">
            <Sparkles className="w-4 h-4 text-[#D4A017] shrink-0" />
            <h3 className="font-serif font-semibold text-base sm:text-lg text-[#9B111E] dark:text-[#D4A017] tracking-wide">
              Admission, Courses और Career Guidance के लिए हमसे जुड़ें
            </h3>
            <Sparkles className="w-4 h-4 text-[#D4A017] shrink-0" />
          </div>
          <p className="font-sans text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
            हमारी टीम आपके सभी सवालों, एडमिशन सहायता और करियर मार्गदर्शन के लिए सदैव उपलब्ध है।
          </p>
        </div>

        {/* ===================================================
            SPLIT LAYOUT
            =================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-start">
          
          {/* LEFT SIDE: Contact Info Cards + Form */}
          <div className="lg:col-span-7 space-y-8 w-full">
            
            {/* Info Cards Grid (2x2) */}
            <motion.div 
              variants={staggerContainer(0.06, 0.03)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {contactInfos.map((info, idx) => (
                <motion.div
                  key={idx}
                  variants={slideUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="h-full p-5 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-[#FFF8F2]/30 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm flex items-start space-x-4 hover:shadow-md hover:border-[#D4A017]/20 transition-all duration-300 text-left group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-950 border border-[#D4A017]/20 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {info.icon}
                  </div>
                  <div className="space-y-1 w-full overflow-hidden">
                    <h4 className="font-serif font-extrabold text-sm text-slate-900 dark:text-white">
                      {info.title}
                    </h4>
                    
                    {info.isLink && info.link ? (
                      <div className="flex flex-col">
                        {info.title === "Call Us" ? (
                          <>
                            <a href={info.link} className="text-xs sm:text-sm text-[#9B111E] dark:text-[#D4A017] hover:underline font-mono font-bold leading-relaxed break-words">
                              099265 61016
                            </a>
                            {info.subLink && (
                              <a href={info.subLink} className="text-xs sm:text-sm text-[#9B111E] dark:text-[#D4A017] hover:underline font-mono font-bold leading-relaxed break-words">
                                9575804021
                              </a>
                            )}
                          </>
                        ) : (
                          <a 
                            href={info.link} 
                            target={info.title === "Website" || info.title === "Address" ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 hover:underline leading-relaxed font-semibold break-words whitespace-pre-line"
                          >
                            {info.content}
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold whitespace-pre-line break-words">
                        {info.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Glassmorphic Contact Form */}
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="p-6 sm:p-10 rounded-[2.5rem] border border-brand-cream-350 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg relative overflow-hidden text-left"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D4A017]" />
              
              <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mb-2">
                Send Enquiry (पूछताछ संदेश)
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-450 mb-8 leading-relaxed font-semibold">
                हमारे एडमिशन काउंसलर्स से संपर्क करने के लिए नीचे दिए गए फॉर्म को भरें।
              </p>

              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Grid Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Full Name (पूरा नाम)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Anand Trivedi"
                            className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold"
                          />
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Phone Number (मोबाइल)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g. +91 99265-61016"
                            className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold"
                          />
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Email + Program Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Email Address (ईमेल)
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. anand@example.com"
                            className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold"
                          />
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        </div>
                      </div>

                      {/* Program select */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Course Interested In (कोर्स चुनें)
                        </label>
                        <div className="relative">
                          <select
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold appearance-none cursor-pointer"
                          >
                            <option value="BPT">BPT (Bachelor of Physiotherapy)</option>
                            <option value="BMLT">BMLT (Bachelor of Medical Lab Tech)</option>
                            <option value="DMLT">DMLT (Diploma in Medical Lab Tech)</option>
                            <option value="BXRT">BXRT (Bachelor in X-Ray Tech)</option>
                            <option value="OT Technician">OT Technician (Operation Theatre Tech)</option>
                          </select>
                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Message (संदेश)
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Write your query here..."
                          className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/20 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] dark:text-slate-200 transition-all font-semibold resize-none"
                        />
                        <MessageSquare className="absolute left-4 top-4 w-4.5 h-4.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center space-x-2.5 px-6 py-4 bg-[#9B111E] hover:bg-[#7a0c16] text-white font-sans font-bold uppercase tracking-wider text-xs rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 mt-2 group"
                    >
                      <span>Send Enquiry / संदेश भेजें</span>
                      <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-800/45 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-serif font-extrabold text-2xl text-slate-900 dark:text-white">
                        Enquiry Sent Successfully!
                      </h4>
                      <p className="text-sm font-semibold text-[#9B111E] dark:text-[#D4A017]">
                        आपका संदेश सफलतापूर्वक भेज दिया गया है।
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-semibold">
                      हमारी प्रशासनिक टीम बहुत जल्द आपके दिए गए विवरण के माध्यम से आपसे संपर्क कर मार्गदर्शन प्रदान करेगी।
                    </p>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: "", phone: "", email: "", course: "BPT", message: "" });
                      }}
                      className="inline-flex items-center space-x-2 px-6 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                    >
                      <span>Back to Form</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>

          {/* RIGHT SIDE: Google Map + Floating Rating Card */}
          <div className="lg:col-span-5 w-full space-y-6 lg:sticky lg:top-24">
            
            {/* Google Map Container wrapper */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[3/4] xl:aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#D4A017]/25 shadow-lg bg-slate-100 dark:bg-slate-900">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.3068995392097!2d80.19307427602061!3d21.8154830802832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a2af79e70a1fceb%3A0x2c077d5a0f3751d2!2sJatashankar%20group%20of%20institute%20paramedical%20allied%20health%20science%20physiotherapy%20College!5e0!3m2!1sen!2sin!4v1716800000000!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[15%] opacity-90 contrast-[105%] dark:grayscale-[50%] dark:invert"
              />

              {/* Floating Quick Info Card on Map */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 right-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#9B111E] to-[#7a0c16] text-white shadow-xl flex items-center space-x-4 border border-[#D4A017]/30 pointer-events-none"
              >
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 text-[#D4A017] shrink-0">
                  <Star className="w-6 h-6 fill-[#D4A017] text-[#D4A017]" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h4 className="font-serif font-extrabold text-sm sm:text-base tracking-wide">
                    4.8 ★ Rated Institute
                  </h4>
                  <p className="text-[10px] sm:text-xs text-white/80 font-semibold leading-tight">
                    Trusted Healthcare & Paramedical Education Institute
                  </p>
                  <p className="text-[9px] text-[#D4A017] font-bold uppercase tracking-widest mt-0.5">
                    35+ Positive Reviews
                  </p>
                </div>
              </motion.div>
            </div>

          </div>

        </div>

        {/* ===================================================
            BOTTOM CTA STRIP
            =================================================== */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full p-6 sm:p-8 rounded-[2rem] sm:rounded-full bg-white dark:bg-slate-900 border border-brand-cream-350 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 px-8 xl:px-12"
        >
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#FFF8F2] dark:bg-slate-950 border border-[#D4A017]/25 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#9B111E]" />
            </div>
            <h4 className="font-serif font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-tight">
              अपने उज्जवल मेडिकल करियर की शुरुआत आज ही करें
            </h4>
          </div>

          <div className="flex flex-row items-center gap-4 w-full md:w-auto shrink-0 justify-center sm:justify-start">
            <a 
              href="#contact" 
              className="flex-1 sm:flex-initial text-center px-6 py-3 bg-[#9B111E] hover:bg-[#7a0c16] text-white font-sans font-bold uppercase tracking-wider text-xs rounded-full shadow-sm hover:shadow-md transition-all duration-300"
            >
              Apply Now
            </a>
            <a 
              href="tel:09926561016" 
              className="flex-1 sm:flex-initial text-center px-6 py-3 bg-white dark:bg-slate-955 border border-[#D4A017]/40 hover:border-[#9B111E] text-[#9B111E] dark:text-[#D4A017] font-sans font-bold uppercase tracking-wider text-xs rounded-full shadow-sm transition-all duration-300"
            >
              Call Now
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
