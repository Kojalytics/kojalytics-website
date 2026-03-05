"use client";

import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Smartphone,
  Shield,
  CreditCard,
  RefreshCw,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

const faqs = [
  {
    icon: ImageIcon,
    question: "How does PortraitPro AI work?",
    answer:
      "Upload 5-10 selfies and our AI creates professional, studio-quality portraits in various styles. The process takes just a few minutes, and you'll receive high-resolution images ready for LinkedIn, resumes, or social media.",
  },
  {
    icon: CreditCard,
    question: "What are the pricing plans?",
    answer:
      "We offer two plans: Starter (€4.99) includes 12 AI-generated portraits, and Premium (€9.99) includes 24 portraits with more style options. Both are one-time purchases — no subscriptions.",
  },
  {
    icon: RefreshCw,
    question: "Can I get a refund?",
    answer:
      "If you're not satisfied with your portraits, contact us within 14 days of purchase at support@kojalytics.com. We'll review your case and process a refund if the quality didn't meet expectations.",
  },
  {
    icon: Shield,
    question: "Is my data safe?",
    answer:
      "Absolutely. Your photos are processed securely and automatically deleted from our servers after portrait generation. We never share, sell, or use your images for training purposes.",
  },
  {
    icon: Smartphone,
    question: "Which devices are supported?",
    answer:
      "PortraitPro AI is available on iPhone (iOS 16+). We're working on expanding to iPad and Android in future updates.",
  },
  {
    icon: Trash2,
    question: "How do I delete my account and data?",
    answer:
      "You can delete your account and all associated data directly in the app under Settings → Account → Delete Account. All your data will be permanently removed within 48 hours. You can also email us at support@kojalytics.com.",
  },
];

function FAQItem({ faq }: { faq: (typeof faqs)[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-6 text-left hover:bg-surface-light/50 transition-colors"
      >
        <faq.icon className="w-5 h-5 text-accent-light shrink-0" />
        <span className="font-semibold flex-1">{faq.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <p className="px-6 pb-6 text-muted leading-relaxed pl-15">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-mono text-accent tracking-wider uppercase">
              Support Center
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              How can we <span className="gradient-text">help?</span>
            </h1>
            <p className="mt-6 text-muted text-lg max-w-xl mx-auto">
              Find answers to common questions about PortraitPro AI, or reach
              out to our team directly.
            </p>
          </motion.div>

          {/* Contact cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
          >
            <a
              href="mailto:support@kojalytics.com"
              className="glass-card rounded-2xl p-8 flex items-start gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <Mail className="w-6 h-6 text-accent-light" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Email Support</h3>
                <p className="text-muted mt-1 text-sm">
                  Get help within 24 hours
                </p>
                <p className="text-accent-light mt-3 text-sm font-medium">
                  support@kojalytics.com
                </p>
              </div>
            </a>

            <Link
              href="/contact"
              className="glass-card rounded-2xl p-8 flex items-start gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-accent-light" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Contact Form</h3>
                <p className="text-muted mt-1 text-sm">
                  Send us a detailed message
                </p>
                <p className="text-accent-light mt-3 text-sm font-medium">
                  Go to contact page →
                </p>
              </div>
            </Link>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-6 h-6 text-accent-light" />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} faq={faq} />
              ))}
            </div>
          </motion.div>

          {/* App info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 glass-card rounded-2xl p-10 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">PortraitPro AI</h3>
            <p className="text-muted max-w-lg mx-auto">
              Professional AI portraits in minutes. Available on the App Store.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@kojalytics.com?subject=PortraitPro%20AI%20Support"
                className="btn-gradient text-sm"
              >
                <span>Contact Support</span>
              </a>
              <span className="text-sm text-muted">
                Developer: Kojalytics
              </span>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
