export interface FitbitWeightDataPoint {
    logId: number,
    weight: number,
    bmi: number,
    fat: number,
    date: string
    time: string,
    source: string
}

export interface FitbitWeightDataPointMetric extends FitbitWeightDataPoint {
}