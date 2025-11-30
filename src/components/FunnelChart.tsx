import { type TooltipItem } from "chart.js";
import { useState } from "react";

import { Chart } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface IFunnelDataPoint {
  date: string;
  totalTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  crRate: number;
}

interface Props {
  data: IFunnelDataPoint | null;
}

export const FunnelChart = ({ data }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const labels = [
    "Total Transactions",
    "Completed Transactions",
    "Failed Transactions",
  ];

  const values = [
    data?.totalTransactions || 0,
    data?.completedTransactions || 0,
    data?.failedTransactions || 0,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: `Transactions funnel`,
        data: values,
        backgroundColor: ["#4e79a7", "#59a14f", "#e15759"],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"funnel">) => {
            const value = ctx.raw as number;
            const label = ctx.label || "";
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="flip-card">
      <div
        className={`flip-card-inner cursor-pointer ${
          isFlipped ? "flipped" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front - Summary */}
        <div className="flip-card-front">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Funnel Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>Total Transactions: {data?.totalTransactions || 0}</div>
              <div>
                Completed Transactions: {data?.completedTransactions || 0}
              </div>
              <div>Failed Transactions: {data?.failedTransactions || 0}</div>
              <div>Customer Retention Rate: {data?.crRate || 0}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Back - Funnel Chart */}
        <div className="flip-card-back">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Funnel Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.values(data || {}).filter(
                (v) => v !== null && v !== undefined && v > 0
              ).length === 0 ? (
                <div className="flex h-48 w-full items-center justify-center text-sm text-muted-foreground">
                  No data available
                </div>
              ) : (
                <Chart type="funnel" data={chartData} options={options} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
