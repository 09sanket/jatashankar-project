"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, Phone, Globe, Layout, Search, Image as ImageIcon, Save, Loader2, AlertCircle, CheckCircle, HelpCircle
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { uploadImage } from "../../../services/cloudinary.service";
import { 
  getWebsiteSettings, 
  updateWebsiteSettings, 
  WebsiteSettings 
} from "../../../services/settings.service";
import { showToast } from "../../../lib/toast";
import { settingsSchema, SettingsSchemaType } from "../../../validations/settings.schema";
import FormInput from "../../../components/forms/FormInput";
import FormTextarea from "../../../components/forms/FormTextarea";
import FormFileUpload from "../../../components/forms/FormFileUpload";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
} as const;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Notifications
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SettingsSchemaType>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      instituteName: "",
      hindiName: "",
      address: "",
      phone: "",
      whatsapp: "",
      email: "",
      facebook: "",
      instagram: "",
      youtube: "",
      website: "",
      heroTitle: "",
      heroDescription: "",
      heroBadgeText: "",
      heroCtaPrimaryText: "",
      heroCtaSecondaryText: "",
      heroHighlightText: "",
      metaTitle: "",
      metaDescription: "",
      footerText: "",
      footerDescription: "",
      footerTagline: "",
      footerCtaText: "",
      logoUrl: "",
      logoPublicId: "",
      metaKeywords: "",
      ogTitle: "",
      ogDescription: "",
      twitterTitle: "",
      twitterDescription: "",
      faviconUrl: "",
      seoImageUrl: "",
      googleAnalyticsId: "",
      googleSearchConsoleVerification: "",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getWebsiteSettings();
      if (data) {
        reset(data);
        setCurrentLogoUrl(data.logoUrl);
        setPreviewUrl(data.logoUrl);
      }
    } catch (err) {
      console.error("Failed to load website settings:", err);
      setErrorMsg("Failed to retrieve website settings from database.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setValue("logoUrl", "https://example.com/temp-preview-logo.png", { shouldValidate: true });
      setErrorMsg(null);
    } else {
      setPreviewUrl(currentLogoUrl);
      setValue("logoUrl", currentLogoUrl || "", { shouldValidate: true });
    }
  };

  const onSaveSubmit = async (data: SettingsSchemaType) => {
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let finalLogoUrl = data.logoUrl;
      let finalLogoPublicId = data.logoPublicId || "";

      // Upload logo to Cloudinary if new logo selected
      if (selectedFile) {
        setIsUploadingLogo(true);
        try {
          const uploadResult = await uploadImage(selectedFile);
          finalLogoUrl = uploadResult.url;
          finalLogoPublicId = uploadResult.publicId;
          setCurrentLogoUrl(finalLogoUrl);
          setSelectedFile(null);
        } catch (uploadErr: any) {
          console.error("Logo upload error:", uploadErr);
          throw new Error(`Logo Image upload failed: ${uploadErr.message || uploadErr}`);
        } finally {
          setIsUploadingLogo(false);
        }
      }

      const settingsPayload: WebsiteSettings = {
        instituteName: data.instituteName.trim(),
        hindiName: data.hindiName.trim(),
        address: data.address.trim(),
        phone: data.phone.trim(),
        whatsapp: data.whatsapp.trim(),
        email: data.email.trim(),
        facebook: data.facebook?.trim() || "",
        instagram: data.instagram?.trim() || "",
        youtube: data.youtube?.trim() || "",
        website: data.website?.trim() || "",
        heroTitle: data.heroTitle.trim(),
        heroDescription: data.heroDescription.trim(),
        heroBadgeText: data.heroBadgeText.trim(),
        heroCtaPrimaryText: data.heroCtaPrimaryText.trim(),
        heroCtaSecondaryText: data.heroCtaSecondaryText.trim(),
        heroHighlightText: data.heroHighlightText?.trim() || "",
        metaTitle: data.metaTitle.trim(),
        metaDescription: data.metaDescription.trim(),
        footerText: data.footerText.trim(),
        footerDescription: data.footerDescription.trim(),
        footerTagline: data.footerTagline.trim(),
        footerCtaText: data.footerCtaText.trim(),
        logoUrl: finalLogoUrl,
        logoPublicId: finalLogoPublicId,
        metaKeywords: data.metaKeywords?.trim() || "",
        ogTitle: data.ogTitle?.trim() || "",
        ogDescription: data.ogDescription?.trim() || "",
        twitterTitle: data.twitterTitle?.trim() || "",
        twitterDescription: data.twitterDescription?.trim() || "",
        faviconUrl: data.faviconUrl?.trim() || "",
        seoImageUrl: data.seoImageUrl?.trim() || "",
        googleAnalyticsId: data.googleAnalyticsId?.trim() || "",
        googleSearchConsoleVerification: data.googleSearchConsoleVerification?.trim() || "",
      };

      await updateWebsiteSettings(settingsPayload);

      // Sync form state
      reset(settingsPayload);
      setSuccessMsg("Website Settings Updated Successfully ✅");
      showToast.success("Website Settings Updated Successfully ✅");
    } catch (err: any) {
      console.error("Save website settings error:", err);
      setErrorMsg(err.message || "An error occurred while saving website settings.");
      showToast.error("Settings Update Failed", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-16 text-left">
        {/* Page Header */}
        <div className="border-l-4 border-[#9B111E] pl-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            Website Settings
          </h2>
          <p className="text-xs text-slate-550 font-semibold">
            Configure global website information, logo branding, social links, landing hero, and search engine metadata.
          </p>
        </div>

        {/* Global Notifications */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-50 dark:bg-red-955/20 border border-red-200/50 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-green-50 dark:bg-green-955/20 border border-green-200/50 dark:border-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium animate-pulse space-y-4">
                <div className="w-1/3 h-5 bg-slate-150 dark:bg-slate-800 rounded" />
                <div className="w-full h-10 bg-slate-100 dark:bg-slate-850 rounded-xl" />
                <div className="w-full h-10 bg-slate-100 dark:bg-slate-850 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSaveSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN */}
              <div className="space-y-8">
                
                {/* Section 1: Institute Information */}
                <motion.div
                  className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium space-y-6"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-[#D4A017]" />
                    <h3 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Institute Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label="Institute Name"
                      required
                      placeholder="e.g. Jatashankar Group of Institutions"
                      error={errors.instituteName?.message}
                      {...register("instituteName")}
                    />

                    <FormInput
                      label="Hindi / Regional Name"
                      required
                      placeholder="e.g. जटाशंकर ग्रुप ऑफ़ इंस्टिट्यूशन"
                      error={errors.hindiName?.message}
                      {...register("hindiName")}
                    />

                    <FormTextarea
                      label="Campus Address"
                      required
                      rows={3}
                      placeholder="Enter official physical campus address"
                      error={errors.address?.message}
                      {...register("address")}
                    />
                  </div>
                </motion.div>

                {/* Section 2: Contact Information */}
                <motion.div
                  className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium space-y-6"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#D4A017]" />
                    <h3 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Contact Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Official Phone Number"
                      required
                      placeholder="e.g. +91 94251 12345"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />

                    <FormInput
                      label="WhatsApp Number"
                      required
                      placeholder="e.g. +91 94251 12345"
                      error={errors.whatsapp?.message}
                      {...register("whatsapp")}
                    />
                  </div>

                  <FormInput
                    label="Official Email Address"
                    required
                    placeholder="e.g. contact@jatashankar.org"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </motion.div>

                {/* Section 3: Social Media Links */}
                <motion.div
                  className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium space-y-6"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#D4A017]" />
                    <h3 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Social Media Links
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Facebook URL"
                      placeholder="https://facebook.com/..."
                      error={errors.facebook?.message}
                      {...register("facebook")}
                    />

                    <FormInput
                      label="Instagram URL"
                      placeholder="https://instagram.com/..."
                      error={errors.instagram?.message}
                      {...register("instagram")}
                    />

                    <FormInput
                      label="YouTube Channel URL"
                      placeholder="https://youtube.com/..."
                      error={errors.youtube?.message}
                      {...register("youtube")}
                    />

                    <FormInput
                      label="Main website / Portal URL"
                      placeholder="https://jatashankar.org"
                      error={errors.website?.message}
                      {...register("website")}
                    />
                  </div>
                </motion.div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-8">

                {/* Section 4: Hero Section Content */}
                <motion.div
                  className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium space-y-6"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                    <Layout className="w-4 h-4 text-[#D4A017]" />
                    <h3 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Hero Section Content
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label="Hero Title"
                      required
                      placeholder="Enter page landing main title"
                      error={errors.heroTitle?.message}
                      {...register("heroTitle")}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Hero Badge Text"
                        required
                        placeholder="e.g. Healthcare & Paramedical Institute"
                        error={errors.heroBadgeText?.message}
                        {...register("heroBadgeText")}
                      />

                      <FormInput
                        label="Hero Highlight Phrase"
                        placeholder="Word or phrase in title to highlight"
                        error={errors.heroHighlightText?.message}
                        {...register("heroHighlightText")}
                      />
                    </div>

                    <FormTextarea
                      label="Hero Description / Subtitle"
                      required
                      rows={3}
                      placeholder="Enter landing page subtitle text description"
                      error={errors.heroDescription?.message}
                      {...register("heroDescription")}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Primary CTA Button Text"
                        required
                        placeholder="e.g. Apply Now / अभी आवेदन करें"
                        error={errors.heroCtaPrimaryText?.message}
                        {...register("heroCtaPrimaryText")}
                      />

                      <FormInput
                        label="Secondary CTA Button Text"
                        required
                        placeholder="e.g. Call Now / कॉल करें"
                        error={errors.heroCtaSecondaryText?.message}
                        {...register("heroCtaSecondaryText")}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Section 5 & 6: SEO & Footer Settings */}
                <motion.div
                  className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium space-y-6"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-[#D4A017]" />
                    <h3 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      SEO & Footer Settings
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label="SEO Meta Title"
                      required
                      placeholder="Default title tag of search presence"
                      error={errors.metaTitle?.message}
                      {...register("metaTitle")}
                    />

                    <FormTextarea
                      label="SEO Meta Description"
                      required
                      rows={2}
                      placeholder="Search engine snippet description context"
                      error={errors.metaDescription?.message}
                      {...register("metaDescription")}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Google Analytics Measurement ID"
                        placeholder="e.g. G-XXXXXXXXXX"
                        error={errors.googleAnalyticsId?.message}
                        {...register("googleAnalyticsId")}
                      />

                      <FormInput
                        label="Google Search Console Verification"
                        placeholder="e.g. google-site-verification=..."
                        error={errors.googleSearchConsoleVerification?.message}
                        {...register("googleSearchConsoleVerification")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Footer Tagline"
                        required
                        placeholder="e.g. Group of Institutions"
                        error={errors.footerTagline?.message}
                        {...register("footerTagline")}
                      />

                      <FormInput
                        label="Footer CTA Text"
                        required
                        placeholder="e.g. Designed & Developed with ❤️"
                        error={errors.footerCtaText?.message}
                        {...register("footerCtaText")}
                      />
                    </div>

                    <FormTextarea
                      label="Footer Short Description"
                      required
                      rows={2}
                      placeholder="Short description for left branding column"
                      error={errors.footerDescription?.message}
                      {...register("footerDescription")}
                    />

                    <FormInput
                      label="Footer Text / Copyright"
                      required
                      placeholder="e.g. © 2026 Jatashankar Group of Institutions. All rights reserved."
                      error={errors.footerText?.message}
                      {...register("footerText")}
                    />
                  </div>
                </motion.div>

                {/* Section 7: Logo Upload */}
                <motion.div
                  className="p-6 sm:p-8 rounded-3xl border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium space-y-6"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-[#D4A017]" />
                    <h3 className="text-xs sm:text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Website Logo Upload
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <Controller
                      control={control}
                      name="logoUrl"
                      render={({ fieldState }) => (
                        <FormFileUpload
                          label="Branding Logo Image"
                          required
                          previewUrl={previewUrl || undefined}
                          error={fieldState.error?.message}
                          onChange={handleFileChange}
                          onClear={() => handleFileChange(null)}
                          containerClassName="w-full"
                        />
                      )}
                    />
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider pl-1">
                      {selectedFile ? "New logo file loaded - Will replace current logo on save." : "Upload institutional identity logo. Max 5MB, formats: PNG, JPG, WEBP."}
                    </p>
                  </div>
                </motion.div>

              </div>
              
            </div>

            {/* Save Buttons & Loading bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-2 text-slate-450 dark:text-slate-400 text-[10px] sm:text-xs font-semibold pl-2">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Verify all settings inputs are accurate before submitting updates to production database.</span>
              </div>
              
              <button
                type="submit"
                disabled={isSaving || isUploadingLogo}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-350 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-2xl transition-all cursor-pointer shadow-premium shrink-0"
              >
                {isSaving || isUploadingLogo ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Website Settings...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Website Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
