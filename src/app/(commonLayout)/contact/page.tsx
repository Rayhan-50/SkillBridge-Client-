"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Loader2, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
  { icon: Mail, title: "Email Us", value: "hello@skillbridge.io", sub: "We reply within 24 hours", href: "mailto:hello@skillbridge.io" },
  { icon: Phone, title: "Call Us", value: "+1 (800) SKILL-BR", sub: "Mon–Fri, 9am–6pm EST", href: "tel:+18007545526" },
  { icon: MapPin, title: "Our Office", value: "450 Serra Mall, Stanford", sub: "Palo Alto, CA 94305", href: "#" },
  { icon: Clock, title: "Support Hours", value: "24/7 Online", sub: "Live chat available anytime", href: "#" },
];

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      {/* Hero Section */}
      <section className="relative py-24 bg-white dark:bg-[#0f172a]/60 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-[#6366f1] text-[13px] font-medium mb-6">
            <MessageCircle className="w-3.5 h-3.5" /> Get in Touch
          </div>
          <h1 className="text-[40px] md:text-[56px] font-medium mb-6 tracking-tight leading-[1.1] text-slate-900 dark:text-slate-50">
            We&apos;d love to <span className="text-[#6366f1]">hear from you</span>
          </h1>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-[1.7]">
            Questions, feedback, or partnership inquiries — our team is here to help. Drop us a message and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, i) => (
              <motion.a
                key={item.title}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                className="bg-white dark:bg-[#0f172a]/40 border border-slate-200 dark:border-slate-800 rounded-[16px] p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 block"
              >
                <div className="w-12 h-12 rounded-[12px] bg-indigo-50 dark:bg-indigo-500/10 text-[#6366f1] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-[16px] text-slate-900 dark:text-slate-50 mb-1">{item.title}</h3>
                <p className="font-medium text-[16px] text-[#6366f1] mb-2">{item.value}</p>
                <p className="text-[13px] text-slate-500 leading-relaxed">{item.sub}</p>
              </motion.a>
            ))}
          </div>

          {/* Form Section */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f172a]/40 border border-slate-200 dark:border-slate-800 rounded-[24px] p-8 md:p-12 shadow-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-[28px] font-medium text-slate-900 dark:text-slate-50 mb-4 tracking-tight">Message Sent!</h3>
                  <p className="text-[16px] text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-[1.7]">
                    Thanks for reaching out. A member of our team will get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      form.reset();
                    }}
                    className="bg-[#6366f1] text-white hover:bg-[#6366f1]/90 rounded-[12px] h-12 px-8 font-medium hover:-translate-y-0.5 active:scale-98 transition-all"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-[28px] font-medium text-slate-900 dark:text-slate-50 mb-2 tracking-tight">Send us a message</h2>
                    <p className="text-[16px] text-slate-600 dark:text-slate-400">Fill out the form and we'll respond as soon as possible.</p>
                  </div>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Smith"
                          {...form.register("name")}
                          className={`h-12 rounded-[12px] bg-[#f8fafc] dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-[#6366f1] text-[16px] ${form.formState.errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {form.formState.errors.name && <p className="text-[13px] text-red-500 font-medium mt-1">{form.formState.errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...form.register("email")}
                          className={`h-12 rounded-[12px] bg-[#f8fafc] dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-[#6366f1] text-[16px] ${form.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {form.formState.errors.email && <p className="text-[13px] text-red-500 font-medium mt-1">{form.formState.errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        {...form.register("subject")}
                        className={`h-12 rounded-[12px] bg-[#f8fafc] dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-[#6366f1] text-[16px] ${form.formState.errors.subject ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {form.formState.errors.subject && <p className="text-[13px] text-red-500 font-medium mt-1">{form.formState.errors.subject.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        {...form.register("message")}
                        className={`min-h-[160px] resize-none rounded-[12px] bg-[#f8fafc] dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-[#6366f1] text-[16px] p-4 ${form.formState.errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {form.formState.errors.message && <p className="text-[13px] text-red-500 font-medium mt-1">{form.formState.errors.message.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-[12px] bg-[#6366f1] text-white hover:bg-[#6366f1]/90 font-medium text-[16px] hover:-translate-y-0.5 active:scale-98 transition-all"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending...</>
                      ) : (
                        <><Send className="w-5 h-5 mr-2" /> Send Message</>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
