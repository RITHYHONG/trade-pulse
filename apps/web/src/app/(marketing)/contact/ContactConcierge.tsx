"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Sparkles, X, BrainCircuit, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const QUICK_QUESTIONS = [
      "What is the free trial policy?",
      "How real-time is the data?",
      "Do you support crypto?"
];

export function ContactConcierge() {
      const [isOpen, setIsOpen] = useState(false);
      const [message, setMessage] = useState('');
      const [response, setResponse] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(false);

      const handleAsk = async (q: string = message) => {
            if (!q.trim()) return;
            setIsLoading(true);
            setResponse(null);
            try {
                  const res = await fetch('/api/contact/concierge', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: q })
                  });
                  const data = await res.json();
                  setResponse(data.response);
            } catch (error) {
                  console.error('Concierge Error:', error);
                  setResponse("I'm sorry, I'm having trouble connecting. Please use the form below for help!");
            } finally {
                  setIsLoading(false);
            }
      };

      return (
            <div className="relative">
                  <AnimatePresence>
                        {!isOpen ? (
                              <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors"
                                    onClick={() => setIsOpen(true)}
                              >
                                    <div className="flex gap-4 items-center">
                                          <div className="p-3 rounded-xl bg-primary/20 text-primary">
                                                <BrainCircuit className="w-6 h-6" />
                                          </div>
                                          <div className="space-y-1">
                                                <h4 className="font-bold text-foreground">Have a quick question?</h4>
                                                <p className="text-sm text-muted-foreground">Ask our AI Front-Desk for instant answers.</p>
                                          </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                          <Sparkles className="w-5 h-5 text-primary" />
                                    </Button>
                              </motion.div>
                        ) : (
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-card border border-primary/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                              >
                                    <div className="absolute top-0 right-0 p-4">
                                          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
                                                <X className="w-4 h-4" />
                                          </Button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-6 text-primary">
                                          <Sparkles className="w-4 h-4" />
                                          <span className="text-xs font-bold uppercase tracking-widest">AI Concierge</span>
                                    </div>

                                    <div className="space-y-6">
                                          {!response && !isLoading && (
                                                <div className="space-y-4">
                                                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-tight">Suggested Questions:</p>
                                                      <div className="flex flex-wrap gap-2">
                                                            {QUICK_QUESTIONS.map((q) => (
                                                                  <Badge
                                                                        key={q}
                                                                        variant="secondary"
                                                                        className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors py-1 px-3 text-xs"
                                                                        onClick={() => {
                                                                              setMessage(q);
                                                                              handleAsk(q);
                                                                        }}
                                                                  >
                                                                        {q}
                                                                  </Badge>
                                                            ))}
                                                      </div>
                                                </div>
                                          )}

                                          {isLoading && (
                                                <div className="flex gap-3 py-4">
                                                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                                                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                                </div>
                                          )}

                                          {response && (
                                                <motion.div
                                                      initial={{ opacity: 0 }}
                                                      animate={{ opacity: 1 }}
                                                      className="bg-primary/5 rounded-xl p-4 border border-primary/10 relative"
                                                >
                                                      <div className="flex gap-3">
                                                            <div className="p-1.5 h-fit rounded-lg bg-primary/20 text-primary">
                                                                  <Info className="w-3.5 h-3.5" />
                                                            </div>
                                                            <p className="text-sm font-medium leading-relaxed">{response}</p>
                                                      </div>
                                                      <Button
                                                            variant="link"
                                                            className="text-[10px] uppercase font-bold text-primary p-0 h-auto mt-2 ml-8"
                                                            onClick={() => setResponse(null)}
                                                      >
                                                            Ask something else
                                                      </Button>
                                                </motion.div>
                                          )}

                                          <div className="flex gap-2">
                                                <Input
                                                      placeholder="Type your question..."
                                                      value={message}
                                                      onChange={(e) => setMessage(e.target.value)}
                                                      onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                                                      className="bg-background border-border/40 focus-visible:ring-primary/20"
                                                />
                                                <Button size="icon" onClick={() => handleAsk()} disabled={isLoading || !message.trim()}>
                                                      <Send className="w-4 h-4" />
                                                </Button>
                                          </div>
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}
