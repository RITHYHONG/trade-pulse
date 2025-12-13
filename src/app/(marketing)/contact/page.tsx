"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  supportFormSchema,
  partnershipsSchema,
  generalInquiriesSchema,
  pressMediaSchema,
} from "@/lib/validations";
import { submitContactForm, uploadAttachment } from "@/lib/contact-service";



type ContactMethod = 'support' | 'partnerships' | 'general' | 'press';

interface ContactMethodInfo {
  id: ContactMethod;
  title: string;
  icon: string;
  description: string;
  responseTime: string;
  priority: 'high' | 'medium';
  bestFor: string[];
}

const contactMethods: ContactMethodInfo[] = [
  {
    id: 'support',
    title: 'Technical Support',
    icon: '🔧',
    description: 'Get help with platform issues, bugs, or technical questions',
    responseTime: 'Typically within 4 hours',
    priority: 'high',
    bestFor: ['Bug reports', 'Login issues', 'Feature problems']
  },
  {
    id: 'partnerships',
    title: 'Partnerships & Enterprise',
    icon: '🤝',
    description: 'Institutional pricing, API access, and custom solutions',
    responseTime: 'Within 24 hours',
    priority: 'medium',
    bestFor: ['Broker integrations', 'Enterprise sales', 'API access']
  },
  {
    id: 'general',
    title: 'General Questions',
    icon: '💬',
    description: 'Platform questions, billing, and general information',
    responseTime: 'Within 12 hours',
    priority: 'medium',
    bestFor: ['Pricing questions', 'Account management', 'General info']
  },
  {
    id: 'press',
    title: 'Press & Media',
    icon: '📰',
    description: 'Interview requests, media kits, and press releases',
    responseTime: 'Within 2 hours',
    priority: 'high',
    bestFor: ['Journalists', 'Content creators', 'Media inquiries']
  }
];

const immediateHelpOptions = [
  {
    title: "📚 Knowledge Base",
    content: "Search our comprehensive help documentation and tutorials",
    action: "Search input",
    icon: "#00F5FF"
  },
  {
    title: "🔔 Status Page",
    content: "Check real-time platform status and incident reports",
    action: "Link to status page",
    icon: "#F59E0B"
  },
  {
    title: "💬 Community Forum",
    content: "Get help from other experienced traders in our community",
    action: "Link to forum",
    icon: "#0066FF"
  },
  {
    title: "🎥 Video Tutorials",
    content: "Watch step-by-step guides for all platform features",
    action: "Link to YouTube",
    icon: "#EF4444"
  }
];

const contactInfo = [
  {
    department: "Technical Support",
    email: "support@tradersdailyedge.com",
    responseTime: "4 hours typical",
    availability: "24/7 for critical issues"
  },
  {
    department: "Partnerships",
    email: "partnerships@tradersdailyedge.com",
    responseTime: "24 hours",
    availability: "Business days, 9AM-6PM EST"
  },
  {
    department: "General Inquiries",
    email: "hello@tradersdailyedge.com",
    responseTime: "12 hours",
    availability: "Business days, 9AM-6PM EST"
  },
  {
    department: "Press & Media",
    email: "press@tradersdailyedge.com",
    responseTime: "2 hours",
    availability: "Business days, 9AM-6PM EST"
  }
];

export default function ContactPage() {
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const getFormSchema = (method: ContactMethod) => {
    switch (method) {
      case 'support': return supportFormSchema;
      case 'partnerships': return partnershipsSchema;
      case 'general': return generalInquiriesSchema;
      case 'press': return pressMediaSchema;
    }
  };

  const getFormDefaultValues = (method: ContactMethod) => {
    switch (method) {
      case 'support': return { urgency: 'Low - General question', platform: 'Web Dashboard' };
      case 'partnerships': return { timeline: 'Exploring options' };
      case 'general': return { inquiryType: 'Billing Question' };
      case 'press': return { requestType: 'Interview Request' };
    }
  };

  const form = useForm<any>({
    resolver: selectedMethod ? zodResolver(getFormSchema(selectedMethod)) : undefined,
    defaultValues: selectedMethod ? getFormDefaultValues(selectedMethod) : {},
  });

  const handleMethodSelect = (method: ContactMethod) => {
    setSelectedMethod(method);
    form.reset(getFormDefaultValues(method));
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (!selectedMethod) return;

    setIsSubmitting(true);
    try {
      // Upload attachments if any
      let attachmentUrls: string[] = [];
      if (attachments.length > 0) {
        // First create a temporary submission ID for uploads
        const tempId = `temp_${Date.now()}`;
        attachmentUrls = await Promise.all(
          attachments.map(file => uploadAttachment(file, tempId))
        );
      }

      // Prepare submission data
      const submissionData = {
        contactType: selectedMethod,
        name: data.name,
        email: data.email,
        subject: data.subject,
        ...(selectedMethod === 'support' && {
          urgency: data.urgency,
          platform: data.platform,
          description: data.description,
          attachments: attachmentUrls,
        }),
        ...(selectedMethod === 'partnerships' && {
          company: data.company,
          role: data.role,
          useCase: data.useCase,
          timeline: data.timeline,
        }),
        ...(selectedMethod === 'general' && {
          inquiryType: data.inquiryType,
          message: data.message,
        }),
        ...(selectedMethod === 'press' && {
          outlet: data.outlet,
          deadline: data.deadline,
          requestType: data.requestType,
          details: data.details,
        }),
      };

      await submitContactForm(submissionData);
      setShowSuccess(true);
      form.reset();
      setAttachments([]);
      toast.success("Message sent successfully! We'll get back to you soon.");
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponseTime = () => {
    if (!selectedMethod) return '';
    const method = contactMethods.find(m => m.id === selectedMethod);
    return method?.responseTime || '';
  };

  return (
    <div className="min-h-screen bg-[#0F1116] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#00F5FF] to-[#0066FF] bg-clip-text text-transparent">
            How Can We Help Your Trading?
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Choose the fastest way to get the support you need
          </p>
          <Alert className="max-w-2xl mx-auto border-[#F59E0B] bg-[#F59E0B]/10">
            <AlertDescription className="text-[#F59E0B]">
              Platform outage? Check our status page first
            </AlertDescription>
          </Alert>
        </div>

        {/* Contact Method Selector */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedMethod === method.id
                  ? 'border-[#00F5FF] bg-[#1A1D28] shadow-lg shadow-[#00F5FF]/20'
                  : 'border-[#2D3246] bg-[#1A1D28] hover:border-[#0066FF]'
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{method.icon}</div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
                <Badge variant={method.priority === 'high' ? 'default' : 'secondary'} className="mt-2">
                  {method.responseTime}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-sm mb-3">
                  {method.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  {method.bestFor.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedMethod && (
              <Card className="bg-[#1A1D28] border-[#2D3246]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {contactMethods.find(m => m.id === selectedMethod)?.icon}
                    {contactMethods.find(m => m.id === selectedMethod)?.title}
                  </CardTitle>
                  <CardDescription>
                    Response time: {getResponseTime()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Common Fields */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} className="bg-[#0F1116] border-[#2D3246]" />
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} className="bg-[#0F1116] border-[#2D3246]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of your inquiry" {...field} className="bg-[#0F1116] border-[#2D3246]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Dynamic Fields */}
                      {selectedMethod === 'support' && (
                        <>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="urgency"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Urgency Level</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-[#0F1116] border-[#2D3246]">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Low - General question">Low - General question</SelectItem>
                                      <SelectItem value="Medium - Feature not working">Medium - Feature not working</SelectItem>
                                      <SelectItem value="High - Cannot access platform">High - Cannot access platform</SelectItem>
                                      <SelectItem value="Critical - Platform down">Critical - Platform down</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="platform"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Platform</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-[#0F1116] border-[#2D3246]">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Web Dashboard">Web Dashboard</SelectItem>
                                      <SelectItem value="Mobile App">Mobile App</SelectItem>
                                      <SelectItem value="Both">Both</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please describe the issue in detail. Include steps to reproduce if possible..."
                                    className="min-h-[120px] bg-[#0F1116] border-[#2D3246]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div>
                            <FormLabel>Attachments (optional)</FormLabel>
                            <Input
                              type="file"
                              multiple
                              accept=".jpg,.png,.mp4,.mov"
                              onChange={handleFileChange}
                              className="bg-[#0F1116] border-[#2D3246] mt-2"
                            />
                            <p className="text-sm text-gray-400 mt-1">
                              Screenshots or screen recordings help us resolve issues faster (max 10MB)
                            </p>
                            {attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {attachments.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between bg-[#0F1116] p-2 rounded">
                                    <span className="text-sm">{file.name}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeAttachment(index)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {selectedMethod === 'partnerships' && (
                        <>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Company name" {...field} className="bg-[#0F1116] border-[#2D3246]" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your role" {...field} className="bg-[#0F1116] border-[#2D3246]" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="useCase"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Use Case</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us about your proposed partnership or use case..."
                                    className="min-h-[120px] bg-[#0F1116] border-[#2D3246]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="timeline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Timeline</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-[#0F1116] border-[#2D3246]">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Exploring options">Exploring options</SelectItem>
                                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                                    <SelectItem value="6+ months">6+ months</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {selectedMethod === 'general' && (
                        <>
                          <FormField
                            control={form.control}
                            name="inquiryType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Inquiry Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-[#0F1116] border-[#2D3246]">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Billing Question">Billing Question</SelectItem>
                                    <SelectItem value="Account Management">Account Management</SelectItem>
                                    <SelectItem value="Feature Request">Feature Request</SelectItem>
                                    <SelectItem value="Platform Feedback">Platform Feedback</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="How can we help you today?"
                                    className="min-h-[120px] bg-[#0F1116] border-[#2D3246]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {selectedMethod === 'press' && (
                        <>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="outlet"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Media Outlet</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Publication or outlet name" {...field} className="bg-[#0F1116] border-[#2D3246]" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="deadline"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Deadline (optional)</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} className="bg-[#0F1116] border-[#2D3246]" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="requestType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Request Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-[#0F1116] border-[#2D3246]">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Interview Request">Interview Request</SelectItem>
                                    <SelectItem value="Media Kit">Media Kit</SelectItem>
                                    <SelectItem value="Press Release">Press Release</SelectItem>
                                    <SelectItem value="Quote Request">Quote Request</SelectItem>
                                    <SelectItem value="Speaking Engagement">Speaking Engagement</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="details"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Details</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please provide details about your request..."
                                    className="min-h-[120px] bg-[#0F1116] border-[#2D3246]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#00F5FF] to-[#0066FF] hover:from-[#00F5FF]/80 hover:to-[#0066FF]/80"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {!selectedMethod && (
              <Card className="bg-[#1A1D28] border-[#2D3246]">
                <CardContent className="text-center py-12">
                  <p className="text-gray-400">Select a contact method below to get started</p>
                </CardContent>
              </Card>
            )}

            {/* Immediate Help Section */}
            <Card className="bg-[#1A1D28] border-[#2D3246] mt-8">
              <CardHeader>
                <CardTitle>Get Immediate Help</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {immediateHelpOptions.map((option, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <span className="flex items-center gap-2">
                          <span>{option.title.split(' ')[0]}</span>
                          {option.title.substring(option.title.indexOf(' ') + 1)}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-300 mb-2">{option.content}</p>
                        <Button variant="outline" size="sm" className="border-[#2D3246]">
                          {option.action}
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-[#1A1D28] border-[#2D3246]">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-[#00F5FF]">{contact.department}</h4>
                    <p className="text-sm text-gray-300">{contact.email}</p>
                    <p className="text-xs text-gray-400">Response: {contact.responseTime}</p>
                    <p className="text-xs text-gray-400">{contact.availability}</p>
                    {index < contactInfo.length - 1 && <Separator className="mt-3 bg-[#2D3246]" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-[#1A1D28] border-[#2D3246]">
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>🐦</span>
                  <span className="text-sm">@TradersEdge</span>
                  <span className="text-xs text-gray-400">Updates & announcements</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💼</span>
                  <span className="text-sm">Trade Pulse</span>
                  <span className="text-xs text-gray-400">Company news & hiring</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📺</span>
                  <span className="text-sm">Trade Pulse</span>
                  <span className="text-xs text-gray-400">Tutorials & webinars</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}