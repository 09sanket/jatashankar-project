"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText, Trash2, Phone, MessageSquare, Calendar, Mail, MapPin, Eye, EyeOff,
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {
  getEnquiries,
  deleteEnquiry,
  Enquiry,
} from "../../../services/enquiry.service";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import { showToast } from "../../../lib/toast";
import DataTable, { ColumnDef } from "../../../components/common/DataTable";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    setIsLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
      showToast.error("Failed to load admission enquiries.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Search Filtering ──────────────────────────────────────────────────────
  const filteredEnquiries = useMemo(() => {
    if (!searchQuery.trim()) return enquiries;
    const q = searchQuery.toLowerCase().trim();
    return enquiries.filter(
      (enq) =>
        enq.studentName.toLowerCase().includes(q) ||
        enq.phone.includes(q) ||
        enq.course.toLowerCase().includes(q)
    );
  }, [searchQuery, enquiries]);

  // ── Delete Handlers ───────────────────────────────────────────────────────
  const handleDeleteClick = (enq: Enquiry) => {
    setDeleteTargetId(enq.id);
    setDeleteTargetName(enq.studentName);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteEnquiry(deleteTargetId);
      setEnquiries((prev) => prev.filter((item) => item.id !== deleteTargetId));
      if (selectedEnquiry?.id === deleteTargetId) {
        setSelectedEnquiry(null);
      }
      showToast.success("Enquiry Record Deleted Successfully ✅");
      setDeleteTargetId(null);
      setDeleteTargetName("");
    } catch (err: any) {
      console.error("Failed to delete enquiry:", err);
      showToast.error("Failed to delete enquiry record.", err?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setDeleteTargetId(null);
      setDeleteTargetName("");
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const cleanPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const formatDate = (enq: Enquiry) => {
    if (enq.createdAt?.toDate) {
      return enq.createdAt
        .toDate()
        .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return "Recent";
  };

  // ── Column Definitions ────────────────────────────────────────────────────
  const columns: ColumnDef<Enquiry>[] = useMemo(
    () => [
      {
        key: "studentName",
        label: "Student Name",
        sortable: true,
        render: (enq) => (
          <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
            {enq.studentName}
          </span>
        ),
      },
      {
        key: "phone",
        label: "Phone",
        render: (enq) => (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="whitespace-nowrap">{enq.phone}</span>
          </div>
        ),
      },
      {
        key: "email",
        label: "Email",
        hideOnMobile: true,
        render: (enq) =>
          enq.email ? (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[160px]" title={enq.email}>
                {enq.email}
              </span>
            </div>
          ) : (
            <span className="text-slate-400">—</span>
          ),
      },
      {
        key: "course",
        label: "Course",
        sortable: true,
        render: (enq) => (
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#9B111E] bg-[#9B111E]/5 px-2 py-0.5 rounded border border-[#9B111E]/10 whitespace-nowrap">
            {enq.course}
          </span>
        ),
      },
      {
        key: "city",
        label: "City",
        hideOnMobile: true,
        render: (enq) =>
          enq.city ? (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{enq.city}</span>
            </div>
          ) : (
            <span className="text-slate-400">—</span>
          ),
      },
      {
        key: "createdAt",
        label: "Date",
        sortable: true,
        hideOnMobile: true,
        render: (enq) => (
          <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500 text-[10px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="whitespace-nowrap">{formatDate(enq)}</span>
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        headerAlign: "right",
        cellAlign: "right",
        render: (enq) => (
          <div className="flex items-center justify-end gap-1.5">
            {/* Toggle detail view */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEnquiry(selectedEnquiry?.id === enq.id ? null : enq);
              }}
              className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              title="Toggle Details View"
            >
              {selectedEnquiry?.id === enq.id ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Call */}
            <a
              href={`tel:${enq.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg border border-green-100 dark:border-green-900/10 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 transition-colors flex items-center justify-center"
              title="Call Student"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${cleanPhoneNumber(enq.phone)}?text=Hello%20${encodeURIComponent(enq.studentName)},%20this%20is%2520Jatashankar%20Group%20of%20Institutes.%20We%20received%20your%20admission%20enquiry%20regarding%20the%20${encodeURIComponent(enq.course)}%20course.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg border border-[#25D366]/20 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors flex items-center justify-center"
              title="WhatsApp Student"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(enq);
              }}
              className="p-1.5 rounded-lg border border-red-100 dark:border-red-900/10 bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-900/30 text-[#9B111E] hover:text-[#800F19] transition-colors cursor-pointer flex items-center justify-center"
              title="Delete Enquiry Record"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [selectedEnquiry]
  );

  // ── Stats Toolbar ─────────────────────────────────────────────────────────
  const statsToolbar = (
    <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
      <div className="text-left">
        <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Total Leads
        </span>
        <span className="text-xl font-serif font-extrabold text-slate-900 dark:text-white">
          {isLoading ? "…" : enquiries.length}
        </span>
      </div>
      <div className="w-10 h-10 rounded-xl bg-[#9B111E]/5 border border-[#9B111E]/10 flex items-center justify-center">
        <FileText className="w-5 h-5 text-[#9B111E]" />
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Page Heading */}
        <div className="text-left border-l-4 border-[#9B111E] pl-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            Admission Enquiries
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Review and manage student admission leads, view contact information, and initiate call/WhatsApp replies.
          </p>
        </div>

        {/* Detail Panel */}
        {selectedEnquiry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl border border-[#D4A017]/30 bg-[#FFF8F2]/20 dark:bg-slate-900/50 shadow-sm text-left relative overflow-hidden"
          >
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-xs font-bold text-slate-400 hover:text-[#9B111E] px-2.5 py-1 rounded-lg border border-slate-100 hover:border-[#9B111E]/20 bg-white transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#9B111E] bg-[#9B111E]/5 px-2.5 py-0.5 rounded border border-[#9B111E]/10">
                  {selectedEnquiry.course}
                </span>
                <h3 className="text-base font-serif font-extrabold text-slate-900 dark:text-white">
                  {selectedEnquiry.studentName}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedEnquiry.phone}</span>
                </div>
                {selectedEnquiry.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{selectedEnquiry.email}</span>
                  </div>
                )}
                {selectedEnquiry.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{selectedEnquiry.city}</span>
                  </div>
                )}
              </div>

              {selectedEnquiry.message && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 text-left">
                    Student Query Message:
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic whitespace-pre-line text-left">
                    &ldquo;{selectedEnquiry.message}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* DataTable */}
        <DataTable<Enquiry>
          columns={columns}
          data={filteredEnquiries}
          isLoading={isLoading}
          rowKey={(enq) => enq.id}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name, phone, or course..."
          pageSize={10}
          skeletonRows={5}
          emptyTitle="No Enquiries Found"
          emptyDescription="There are no admission enquiries matching your search criteria."
          emptyAction={
            searchQuery
              ? { label: "Clear Search", onClick: () => setSearchQuery("") }
              : undefined
          }
          toolbar={statsToolbar}
          rowClassName={(enq) =>
            selectedEnquiry?.id === enq.id
              ? "bg-[#FFF8F2]/30 dark:bg-slate-800/50"
              : ""
          }
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        itemName={deleteTargetName || "Enquiry"}
      />
    </DashboardLayout>
  );
}
