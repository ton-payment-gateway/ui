import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  kpi: number;
  labels: string[];
  data: number[];
}

const AnalyticsItem = ({ kpi, labels, data }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);

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
                  labels: labels,
                  datasets: [
                    {
                      label: "Value",
                      data: data,
                      borderColor: "hsl(var(--primary))",
                      backgroundColor: "hsla(var(--primary), 0.1)",
                      tension: 0.4,
                    },
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
