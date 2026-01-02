"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import { submitContactForm, ContactSubmission } from "@/lib/contact-service";
import { CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Simplified schema for the "Contact Us" form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      terms: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    setIsSubmitting(true);
    try {
      // Mapping to the existing backend service structure
      // Defaulting to 'general' inquiry type for this unified form
      const submissionData: ContactSubmission = {
        contactType: 'general',
        name: data.name,
        email: data.email,
        subject: "Contact Form Submission",
        inquiryType: "General",
        message: data.message,
      };

      await submitContactForm(submissionData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Contact Us</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Get in touch with us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fill out the form below or schedule a meeting with us at your convenience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Form */}
          <div className="space-y-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} className="bg-background border-input h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter Your Email" {...field} className="bg-background border-input h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Your Message"
                          {...field}
                          className="bg-background border-input min-h-[150px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 text-base font-semibold"
                >
                  {isSubmitting ? "Sending..." : "Send Your Request"}
                </Button>
              </form>
            </Form>

            <div className="space-y-6 pt-4">
              <h3 className="font-semibold text-lg">You can also Contact Us via</h3>
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">contact@traderpulse.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">(+855)96 435 0654</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">@Rithyhong</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Info & Benefits */}
          <div className="flex flex-col justify-between space-y-12">

            <div className="space-y-8">
              <h3 className="font-bold text-xl">With our services you can</h3>
              <ul className="space-y-6">
                {[
                  "Access institutional-grade market data instantaneously",
                  "Identify high-probability setups with AI-driven signals",
                  "Reduce analysis time by 90% with automated screeners",
                  "Balance risk and reward with professional position sizing tools"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-12 mt-12 border-t border-border">
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <MapPin className="w-4 h-4" /> Cambodia
                </div>
                <address className="text-sm text-muted-foreground not-italic leading-relaxed">
                  Toul Kork, Street 123<br />
                  Phnom Penh, Cambodia
                </address>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <MapPin className="w-4 h-4" /> UK
                </div>
                <address className="text-sm text-muted-foreground not-italic leading-relaxed">
                  1 Canada Square<br />
                  London, E14 5AB
                </address>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}