export interface CorrelationData {
  event1: string;
  event2: string;
  strength: number;
  leadLag: 'leads' | 'lags' | 'simultaneous';
  lagMinutes?: number;
}

export class CorrelationService {
  /**
   * Calculates the Pearson correlation coefficient between two series of numbers.
   */
  static pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += (x[i] * y[i]);
      sumX2 += (x[i] * x[i]);
      sumY2 += (y[i] * y[i]);
    }

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  /**
   * Identifies lead-lag relationships by shifting one series.
   */
  static identifyLeadLag(x: number[], y: number[], maxLag: number = 5): { lag: number, strength: number } {
    let bestLag = 0;
    let maxCorr = -1;

    for (let lag = -maxLag; lag <= maxLag; lag++) {
      let shiftedX: number[] = [];
      let shiftedY: number[] = [];

      if (lag > 0) {
        shiftedX = x.slice(0, -lag);
        shiftedY = y.slice(lag);
      } else if (lag < 0) {
        shiftedX = x.slice(-lag);
        shiftedY = y.slice(0, lag);
      } else {
        shiftedX = x;
        shiftedY = y;
      }

      const corr = Math.abs(this.pearsonCorrelation(shiftedX, shiftedY));
      if (corr > maxCorr) {
        maxCorr = corr;
        bestLag = lag;
      }
    }

    return { lag: bestLag, strength: this.pearsonCorrelation(
      bestLag > 0 ? x.slice(0, -bestLag) : x.slice(Math.abs(bestLag)),
      bestLag > 0 ? y.slice(bestLag) : y.slice(0, bestLag) || y
    )};
  }
}
