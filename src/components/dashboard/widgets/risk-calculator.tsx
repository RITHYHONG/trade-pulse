"use client";

import { useState } from "react";
import { Calculator, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function RiskCalculatorWidget() {
      const [balance, setBalance] = useState(10000);
      const [riskPercent, setRiskPercent] = useState(1);
      const [stopLoss, setStopLoss] = useState(20);
      const [pair, setPair] = useState("EURUSD");

      // Simple calculation: 
      // Risk Amount = Balance * (Risk% / 100)
      // Pip Value (approx for standard lots) = $10 per lot
      // Risk = LotSize * StopLoss * PipValue
      // LotSize = Risk / (StopLoss * PipValue)

      const riskAmount = balance * (riskPercent / 100);
      // Assuming 1 standard lot = $10/pip (Simplified for Forex majors)
      const lotSize = stopLoss > 0 ? (riskAmount / (stopLoss * 10)).toFixed(2) : "0.00";

      return (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <Calculator className="h-4 w-4" />
                        </div>
                        <div>
                              <h3 className="font-semibold text-sm text-foreground">Risk Calculator</h3>
                              <p className="text-xs text-muted-foreground">Position Sizing</p>
                        </div>
                  </div>

                  <div className="space-y-5">
                        <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Account Balance ($)</Label>
                              <Input
                                    type="number"
                                    value={balance}
                                    onChange={(e) => setBalance(Number(e.target.value))}
                                    className="h-9 text-sm"
                              />
                        </div>

                        <div className="space-y-4">
                              <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Risk Percentage</span>
                                    <span className="font-mono font-medium text-primary">{riskPercent}%</span>
                              </div>
                              <Slider
                                    value={[riskPercent]}
                                    onValueChange={(v) => setRiskPercent(v[0])}
                                    max={5}
                                    step={0.1}
                                    className="[&>.relative>.absolute]:bg-primary"
                              />
                        </div>

                        <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Stop Loss (Pips)</Label>
                              <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-muted/50" onClick={() => setStopLoss(Math.max(5, stopLoss - 5))}>-</Button>
                                    <Input
                                          type="number"
                                          value={stopLoss}
                                          onChange={(e) => setStopLoss(Number(e.target.value))}
                                          className="h-9 text-center font-mono"
                                    />
                                    <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-muted/50" onClick={() => setStopLoss(stopLoss + 5)}>+</Button>
                              </div>
                        </div>

                        <div className="pt-4 border-t border-border mt-2">
                              <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                          <p className="text-xs text-muted-foreground">Risk Amount</p>
                                          <p className="text-lg font-bold text-destructive">${riskAmount.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                          <p className="text-xs text-muted-foreground">Position Size</p>
                                          <p className="text-lg font-bold text-emerald-500">{lotSize} Lots</p>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
