"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  LifeBuoy,
  ShieldCheck,
  FileText,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Mail,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ComingSoonBanner } from "@/components/workspace/coming-soon-banner";

const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.enum(["bug", "access", "compliance", "billing", "other"], {
    required_error: "Please select a category",
  }),
  description: z.string().min(20, "Please provide at least 20 characters of detail"),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    required_error: "Select a priority level",
  }),
});

type TicketValues = z.infer<typeof ticketSchema>;

const faqs = [
  {
    q: "How do I reset my password?",
    a: "Visit your profile page and use the 'Change password' option. If you're locked out, contact your workspace admin.",
  },
  {
    q: "Who can access my project data?",
    a: "Project members and workspace admins can view project data. All access is logged for compliance purposes.",
  },
  {
    q: "How is my data protected?",
    a: "All data is encrypted in transit and at rest. We follow industry-standard security practices including regular audits.",
  },
  {
    q: "How do I report a security vulnerability?",
    a: "Submit a ticket with category 'Compliance' and priority 'Urgent'. Our security team reviews these within 4 hours.",
  },
  {
    q: "Can I export my workspace data?",
    a: "Admins can request full data exports by submitting a support ticket. Exports are delivered within 48 hours.",
  },
];

const policies = [
  { icon: ShieldCheck, title: "Data Protection", desc: "GDPR-compliant data handling with encryption at rest and in transit. Regular third-party security audits." },
  { icon: FileText, title: "Access Control", desc: "Role-based access with full audit trails. All permission changes are logged and reviewable." },
  { icon: Clock, title: "Data Retention", desc: "Configurable retention policies. Default 24-month retention with automatic archival options." },
  { icon: CheckCircle2, title: "SOC 2 Compliance", desc: "We maintain SOC 2 Type II certification. Reports available to enterprise customers upon request." },
];

export default function SupportPage() {
  const user = useAuthStore((s) => s.user);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    mode: "onChange",
  });

  const onSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Support ticket submitted. We'll respond within 24 hours.");
    reset();
  };

  return (
    <div>
      <ComingSoonBanner />
      <div className="px-6 py-10">
      <div className="border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-highlight">
          Help & Support
        </p>
        <h1 className="mt-2 font-display text-4xl italic text-foreground">
          Compliance & Support
        </h1>
        <p className="mt-3 text-sm text-foreground-muted">
          Report issues, review policies, or reach out to your workspace administrators.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-success/10">
                <CheckCircle2 className="size-7 text-success" />
              </div>
              <h2 className="mt-5 font-display text-xl italic text-foreground">
                Ticket submitted
              </h2>
              <p className="mt-2 max-w-sm text-[13px] text-foreground-muted">
                We&apos;ve received your request. Our support team typically responds within 24 hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => setSubmitted(false)}
              >
                Submit another
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-highlight/10">
                  <LifeBuoy className="size-4 text-highlight" />
                </div>
                <div>
                  <h2 className="font-display text-lg italic text-foreground">
                    Submit a Ticket
                  </h2>
                  <p className="text-[12px] text-foreground-muted">
                    Describe your issue and we&apos;ll get back to you.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-foreground">
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    placeholder="Brief summary of your issue"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                  />
                  {errors.subject && (
                    <p className="text-[12px] text-destructive">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-foreground">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10"
                  >
                    <option value="">Select category</option>
                    <option value="bug">Bug Report</option>
                    <option value="access">Access Issue</option>
                    <option value="compliance">Compliance</option>
                    <option value="billing">Billing</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="text-[12px] text-destructive">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Provide as much detail as possible — steps to reproduce, affected users, error messages..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground shadow-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 resize-none"
                />
                {errors.description && (
                  <p className="text-[12px] text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Priority
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "low", label: "Low", color: "border-border text-foreground-muted" },
                    { value: "medium", label: "Medium", color: "border-info/30 text-info" },
                    { value: "high", label: "High", color: "border-warning/30 text-warning-foreground" },
                    { value: "urgent", label: "Urgent", color: "border-destructive/30 text-destructive" },
                  ].map((p) => (
                    <label
                      key={p.value}
                      className={cn(
                        "cursor-pointer rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors hover:opacity-80",
                        p.color,
                      )}
                    >
                      <input
                        type="radio"
                        value={p.value}
                        {...register("priority")}
                        className="sr-only"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
                {errors.priority && (
                  <p className="text-[12px] text-destructive">{errors.priority.message}</p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-[11px] text-foreground-muted">
                  Submitting as{" "}
                  <span className="text-foreground">{user?.email}</span>
                </p>
                <Button type="submit" disabled={!isValid || submitting} className="gap-1.5">
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      Submit ticket
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <HelpCircle className="size-4 text-foreground-muted" />
              </div>
              <h2 className="font-display text-lg italic text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mt-5 divide-y divide-border">
              {faqs.map((faq, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <span className="text-[13px] font-medium text-foreground">
                      {faq.q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp className="size-4 shrink-0 text-foreground-muted" />
                    ) : (
                      <ChevronDown className="size-4 shrink-0 text-foreground-muted" />
                    )}
                  </button>
                  {openFaq === i && (
                    <p className="mt-2 text-[13px] text-foreground-muted leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 text-highlight" />
              <h3 className="text-sm font-semibold text-foreground">
                Contact Admins
              </h3>
            </div>
            <p className="mt-2 text-[12px] text-foreground-muted leading-relaxed">
              Need immediate help? Your workspace administrators can assist with access issues, permissions, and account questions.
            </p>
            <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5" disabled>
              <MessageSquare className="size-3.5" />
              Message admin
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-4 text-success" />
              <h3 className="text-sm font-semibold text-foreground">
                Compliance
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              {policies.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <p.icon className="size-4 shrink-0 mt-0.5 text-foreground-muted" />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-foreground-muted leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="size-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Report an Incident
              </h3>
            </div>
            <p className="mt-2 text-[12px] text-foreground-muted leading-relaxed">
              For security incidents, data breaches, or urgent compliance matters, use the ticket form and mark it as <strong>Urgent</strong> priority with <strong>Compliance</strong> category.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
