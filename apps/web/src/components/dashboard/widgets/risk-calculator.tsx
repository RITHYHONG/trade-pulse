"use client";

import { useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SavedScenario {
      name: string;
      balance: number;
      riskPercent: number;
      stopLoss: number;
      pair: string;
}

const DEFAULT_SCENARIOS_KEY = "risk-calculator-scenarios";
const DEFAULT_SETTINGS_KEY = "risk-calculator-defaults";

export function RiskCalculatorWidget() {
      const [balance, setBalance] = useState(10000);
      const [riskPercent, setRiskPercent] = useState(1);
      const [stopLoss, setStopLoss] = useState(20);
      const [pair, setPair] = useState("EURUSD");
      const [scenarioName, setScenarioName] = useState("");
      const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

      // Simple calculation: 
      // Risk Amount = Balance * (Risk% / 100)
      // Pip Value (approx for standard lots) = $10 per lot
      // Risk = LotSize * StopLoss * PipValue
      // LotSize = Risk / (StopLoss * PipValue)

      useEffect(() => {
            if (typeof window === "undefined") return;
            const savedDefaults = window.localStorage.getItem(DEFAULT_SETTINGS_KEY);
            if (savedDefaults) {
                  try {
                        const parsed = JSON.parse(savedDefaults) as Partial<SavedScenario>;
                        if (typeof parsed.balance === "number") setBalance(parsed.balance);
                        if (typeof parsed.riskPercent === "number") setRiskPercent(parsed.riskPercent);
                        if (typeof parsed.stopLoss === "number") setStopLoss(parsed.stopLoss);
                        if (typeof parsed.pair === "string") setPair(parsed.pair);
                  } catch {
                        // ignore invalid defaults
                  }
            }
            const saved = window.localStorage.getItem(DEFAULT_SCENARIOS_KEY);
            if (saved) {
                  try {
                        const parsed = JSON.parse(saved) as SavedScenario[];
                        if (Array.isArray(parsed)) setSavedScenarios(parsed);
                  } catch {
                        // ignore invalid scenarios
                  }
            }
      }, []);

      useEffect(() => {
            if (typeof window === "undefined") return;
            window.localStorage.setItem(
                  DEFAULT_SETTINGS_KEY,
                  JSON.stringify({ balance, riskPercent, stopLoss, pair }),
            );
      }, [balance, riskPercent, stopLoss, pair]);

      useEffect(() => {
            if (typeof window === "undefined") return;
            window.localStorage.setItem(DEFAULT_SCENARIOS_KEY, JSON.stringify(savedScenarios));
      }, [savedScenarios]);

      const riskAmount = balance * (riskPercent / 100);
      // Assuming 1 standard lot = $10/pip (Simplified for Forex majors)
      const lotSize = stopLoss > 0 ? (riskAmount / (stopLoss * 10)).toFixed(2) : "0.00";

      const handleSaveScenario = () => {
            const name = scenarioName.trim() || window.prompt("Enter a scenario name")?.trim();
            if (!name) return;
            const scenario: SavedScenario = { name, balance, riskPercent, stopLoss, pair };
            setSavedScenarios((current) => [scenario, ...current.filter((item) => item.name !== name)]);
            setScenarioName("");
      };

      const handleLoadScenario = (scenario: SavedScenario) => {
            setBalance(scenario.balance);
            setRiskPercent(scenario.riskPercent);
            setStopLoss(scenario.stopLoss);
            setPair(scenario.pair);
      };

      const handleDeleteScenario = (name: string) => {
            setSavedScenarios((current) => current.filter((item) => item.name !== name));
      };

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
                              <Label htmlFor="balance-input" className="text-xs text-muted-foreground">Account Balance ($)</Label>
                              <Input
                                    id="balance-input"
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
                              <Label htmlFor="stop-loss-input" className="text-xs text-muted-foreground">Stop Loss (Pips)</Label>
                              <div className="flex gap-2">
                                    <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="h-9 w-9 p-0 bg-muted/50"
                                          onClick={() => setStopLoss(Math.max(5, stopLoss - 5))}
                                          aria-label="Decrease stop loss"
                                    >
                                          -
                                    </Button>
                                    <Input
                                          id="stop-loss-input"
                                          type="number"
                                          value={stopLoss}
                                          onChange={(e) => setStopLoss(Number(e.target.value))}
                                          className="h-9 text-center font-mono"
                                    />
                                    <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="h-9 w-9 p-0 bg-muted/50"
                                          onClick={() => setStopLoss(stopLoss + 5)}
                                          aria-label="Increase stop loss"
                                    >
                                          +
                                    </Button>
                              </div>
                        </div>

                        <div className="space-y-2">
                              <Label htmlFor="pair-select" className="text-xs text-muted-foreground">Instrument</Label>
                              <select
                                    id="pair-select"
                                    aria-label="Select trading pair"
                                    value={pair}
                                    onChange={(e) => setPair(e.target.value)}
                                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                              >
                                    <option value="EURUSD">EURUSD</option>
                                    <option value="GBPUSD">GBPUSD</option>
                                    <option value="USDJPY">USDJPY</option>
                                    <option value="XAUUSD">XAUUSD</option>
                                    <option value="BTCUSD">BTCUSD</option>
                              </select>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-border">
                              <div className="flex items-center gap-2">
                                    <Input
                                          id="scenario-name"
                                          type="text"
                                          value={scenarioName}
                                          onChange={(e) => setScenarioName(e.target.value)}
                                          placeholder="Scenario name"
                                          className="h-9 text-sm"
                                    />
                                    <Button type="button" className="h-9" onClick={handleSaveScenario}>
                                          Save
                                    </Button>
                              </div>
                              {savedScenarios.length > 0 ? (
                                    <div className="space-y-2">
                                          {savedScenarios.map((scenario) => (
                                                <div key={scenario.name} className="flex flex-col gap-2 rounded-xl border border-border bg-muted/50 p-3">
                                                      <div className="flex items-center justify-between gap-4">
                                                            <div>
                                                                  <p className="font-medium">{scenario.name}</p>
                                                                  <p className="text-xs text-muted-foreground">
                                                                        {scenario.balance} USD • {scenario.riskPercent}% risk • {scenario.stopLoss} pips
                                                                  </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                  <Button type="button" size="sm" className="h-8" onClick={() => handleLoadScenario(scenario)}>
                                                                        Load
                                                                  </Button>
                                                                  <Button type="button" variant="outline" size="sm" className="h-8 text-destructive" onClick={() => handleDeleteScenario(scenario.name)}>
                                                                        Delete
                                                                  </Button>
                                                            </div>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              ) : (
                                    <p className="text-xs text-muted-foreground">No saved scenarios yet.</p>
                              )}
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
