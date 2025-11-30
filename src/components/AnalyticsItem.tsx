import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Line } from "react-chartjs-2";
import { useState } from "react";

interface Props {
  kpi: number;
  labels: string[];
  data: number[];
  forecastLabels?: string[];
  forecastData?: number[];
}

const AnalyticsItem = ({
  kpi,
  labels,
  data,
  forecastLabels,
  forecastData,
}: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const hasForecast =
    forecastData &&
    forecastLabels &&
    forecastData.length > 0 &&
    forecastData.length === forecastLabels.length;

  const allLabels = [...labels, ...(hasForecast ? forecastLabels : [])];

  const paddingLength = Math.max(0, labels.length - 1);
  const forecastSeries = hasForecast
    ? [...Array(paddingLength).fill(null), ...forecastData]
    : [];

  return (
    <div className="flip-card">
      <div
        className={`flip-card-inner cursor-pointer ${
          isFlipped ? "flipped" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front - Number */}
        <div className="flip-card-front">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                KPI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{kpi}</div>
            </CardContent>
          </Card>
        </div>

        {/* Back - Chart */}
        <div className="flip-card-back">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <Line
                data={{
                  labels: allLabels,
                  datasets: [
                    {
                      label: "Value",
                      data,
                      borderColor: "hsl(var(--primary))",
                      backgroundColor: "hsla(var(--primary), 0.1)",
                      tension: 0.4,
                    },
                    ...(hasForecast
                      ? [
                          {
                            label: "Forecast",
                            data: forecastSeries,
                            borderColor: "rgba(100, 100, 100, 0.8)",
                            borderDash: [6, 6] as number[],
                            pointRadius: 0,
                            tension: 0.4,
                          },
                        ]
                      : []),
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsItem;
