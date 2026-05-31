"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Image as ImageIcon, Users, BookOpen, 
  Sparkles, ShieldCheck, Mail, ArrowUpRight, Megaphone, Star, Calendar, Phone, Activity
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { 
  getDashboardStats, 
  getRecentEnquiries, 
  getRecentAnnouncements, 
  DashboardStats, 
  RecentEnquiry, 
  RecentAnnouncement 
} from "../../services/dashboard.service";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
} as const;

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<RecentAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsData, enquiriesData, announcementsData] = await Promise.all([
          getDashboardStats(),
          getRecentEnquiries(5),
          getRecentAnnouncements(5),
        ]);
        setStats(statsData);
        setRecentEnquiries(enquiriesData);
        setRecentAnnouncements(announcementsData);
      } catch (err) {
        console.error("Failed to load dashboard data metrics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const statsMeta = [
    { key: "enquiries", name: "Total Enquiries", icon: <FileText className="w-5 h-5 text-[#9B111E]" />, bg: "bg-[#9B111E]/5 border-[#9B111E]/10" },
    { key: "gallery", name: "Gallery Items", icon: <ImageIcon className="w-5 h-5 text-[#D4A017]" />, bg: "bg-[#D4A017]/5 border-[#D4A017]/10" },
    { key: "faculty", name: "Total Faculty", icon: <Users className="w-5 h-5 text-[#9B111E]" />, bg: "bg-[#9B111E]/5 border-[#9B111E]/10" },
    { key: "courses", name: "Total Courses", icon: <BookOpen className="w-5 h-5 text-[#D4A017]" />, bg: "bg-[#D4A017]/5 border-[#D4A017]/10" },
    { key: "announcements", name: "Announcements", icon: <Megaphone className="w-5 h-5 text-[#9B111E]" />, bg: "bg-[#9B111E]/5 border-[#9B111E]/10" },
    { key: "testimonials", name: "Testimonials", icon: <Star className="w-5 h-5 text-[#D4A017]" />, bg: "bg-[#D4A017]/5 border-[#D4A017]/10" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <motion.div 
          className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-[#D4A017]/5 to-transparent blur-2xl pointer-events-none" />
          
          <div className="space-y-2 text-left relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#9B111E]/5 border border-[#9B111E]/10 text-[#9B111E] dark:text-[#E25C65] font-bold text-[9px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Session Authenticated</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome Back, Administrator
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Logged in as:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{user?.email}</span>
            </p>
          </div>

          <div className="shrink-0 relative z-10">
            <a 
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#D4A017] hover:bg-[#FFF8F2] dark:hover:bg-slate-950 text-[#9B111E] dark:text-[#D4A017] font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer"
            >
              <span>Visit Main Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Database Metric Counts Grid */}
        <div className="space-y-4">
          <div className="text-left border-l-4 border-[#9B111E] pl-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Institute Metrics Overview
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-550 font-semibold mt-0.5">
              Real-time document telemetry from active Firestore collections.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Premium Skeleton Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {statsMeta.map((stat) => (
                  <div 
                    key={stat.key}
                    className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col space-y-4 animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-slate-150 dark:bg-slate-800" />
                    <div className="space-y-2">
                      <div className="w-3/4 h-3.5 bg-slate-150 dark:bg-slate-800 rounded" />
                      <div className="w-1/2 h-5 bg-slate-100 dark:bg-slate-850 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {statsMeta.map((stat, idx) => {
                  const val = stats ? stats[stat.key as keyof DashboardStats] : 0;
                  return (
                    <motion.div
                      key={stat.key}
                      className="p-6 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col justify-between hover:border-[#D4A017]/30 transition-all duration-300 relative overflow-hidden group text-left"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.04 }}
                    >
                      <div className="absolute right-4 top-4 opacity-5 group-hover:scale-105 transition-transform duration-300">
                        {stat.icon}
                      </div>

                      <div className="space-y-4">
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${stat.bg}`}>
                          {stat.icon}
                        </div>

                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                            {stat.name}
                          </span>
                          <h4 className="text-2xl font-serif font-extrabold text-slate-900 dark:text-white">
                            {val}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Feeds: Enquiries vs Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Recent Enquiries Feed */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-left border-l-4 border-[#9B111E] pl-4">
              <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Admission Enquiries
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                Latest student inquiries submitted from the admissions modal.
              </p>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                /* Enquiry Skeletons */
                [1, 2].map((n) => (
                  <div key={n} className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col space-y-4 animate-pulse">
                    <div className="flex justify-between">
                      <div className="w-1/3 h-4 bg-slate-150 dark:bg-slate-800 rounded" />
                      <div className="w-1/4 h-3.5 bg-slate-100 dark:bg-slate-850 rounded" />
                    </div>
                    <div className="w-1/2 h-3.5 bg-slate-100 dark:bg-slate-850 rounded" />
                  </div>
                ))
              ) : recentEnquiries.length === 0 ? (
                <div className="py-12 text-center rounded-3xl border border-dashed border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  No Data Available
                </div>
              ) : (
                recentEnquiries.map((enq) => (
                  <motion.div
                    key={enq.id}
                    className="p-5 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:border-[#D4A017]/25 transition-colors"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-serif font-extrabold text-slate-900 dark:text-white truncate">
                          {enq.studentName}
                        </h4>
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9B111E] bg-[#9B111E]/5 px-2.5 py-0.5 rounded-full shrink-0">
                          {enq.course}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{enq.phone}</span>
                        </span>
                        {enq.email && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{enq.email}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {enq.createdAt && (
                      <div className="flex items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-2.5 py-1.5 rounded-xl">
                        <Calendar className="w-3 h-3 text-slate-400 mr-1.5" />
                        <span>
                          {enq.createdAt.toDate 
                            ? enq.createdAt.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "Recent"}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Recent Announcements Feed */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-left border-l-4 border-[#9B111E] pl-4">
              <h3 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Board Notices
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-550 font-semibold mt-0.5">
                Latest published circular notifications.
              </p>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                /* Announcement Skeletons */
                [1, 2].map((n) => (
                  <div key={n} className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col space-y-3 animate-pulse">
                    <div className="w-1/4 h-3.5 bg-slate-150 dark:bg-slate-800 rounded" />
                    <div className="w-4/5 h-4 bg-slate-100 dark:bg-slate-850 rounded" />
                  </div>
                ))
              ) : recentAnnouncements.length === 0 ? (
                <div className="py-12 text-center rounded-3xl border border-dashed border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  No Data Available
                </div>
              ) : (
                recentAnnouncements.map((ann) => (
                  <motion.div
                    key={ann.id}
                    className="p-5 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col gap-3 text-left hover:border-[#D4A017]/25 transition-colors"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        ann.important
                          ? "bg-red-50 text-[#9B111E] dark:bg-red-955/20 dark:text-red-400 border-red-200/50"
                          : "bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400 border-slate-200/50"
                      }`}>
                        {ann.important ? "Urgent" : ann.type}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Calendar className="w-3 h-3 text-slate-400 mr-1" />
                        <span>{ann.date}</span>
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-[#9B111E] transition-colors">
                      {ann.title}
                    </h4>
                  </motion.div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
