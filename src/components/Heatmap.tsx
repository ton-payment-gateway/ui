import { type ChartData, type ChartOptions, type TooltipItem } from "chart.js";
import { Chart } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface IHeatmapDataPoint {
  hour: number;
  day: number;
  count: number;
}

interface Props {
  data: IHeatmapDataPoint[];
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const buildFullGrid = (data: IHeatmapDataPoint[]): IHeatmapDataPoint[] => {
  const map = new Map<string, IHeatmapDataPoint>();

  for (const p of data) {
    map.set(`${p.day}-${p.hour}`, p);
  }

  const full: IHeatmapDataPoint[] = [];

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const key = `${day}-${hour}`;
      full.push(
        map.get(key) ?? {
          day,
          hour,
          count: 0,
        }
      );
    }
  }

  return full;
};

export const Heatmap = ({ data }: Props) => {
  const fullData = buildFullGrid(data);

  const maxCount =
    fullData.reduce((acc, p) => (p.count > acc ? p.count : acc), 0) || 1;

  const matrixData = fullData.map((p) => ({
    x: p.hour,
    y: p.day,
    v: p.count,
  }));

  const chartData: ChartData<"matrix"> = {
    datasets: [
      {
        label: "Transactions by hour & day",
        data: matrixData,
        backgroundColor: (ctx) => {
          const value = (ctx.raw as { v: number } | undefined)?.v ?? 0;
          const alpha = value / maxCount || 0;
          // darker = more transactions
          return `rgba(37, 99, 235, ${alpha || 0.05})`;
        },
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        width: (ctx) => {
          const chart = ctx.chart;
          const chartArea = chart.chartArea;
          if (!chartArea) return 0;

          const xScale = chart.scales.x;
          const ticksCount = xScale.ticks.length || 24;
          return chartArea.width / ticksCount - 2;
        },
        height: (ctx) => {
          const chart = ctx.chart;
          const chartArea = chart.chartArea;
          if (!chartArea) return 0;

          const yScale = chart.scales.y;
          const ticksCount = yScale.ticks.length || 7;
          return chartArea.height / ticksCount - 2;
        },
      },
    ],
  };

  const options: ChartOptions<"matrix"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: 23,
        ticks: {
          callback: (value) => `${value}:00`,
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Hour of day",
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        min: 0,
        max: 6,
        reverse: true,
        ticks: {
          callback: (value) => dayLabels[value as number] || `Day ${value}`,
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Day of week",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const item = items[0];
            const hour = item.parsed.x;
            const dayIndex = item.parsed.y;
            const day = dayLabels[dayIndex] ?? `Day ${dayIndex}`;
            return `${day}, ${hour}:00`;
          },
          label: (ctx: TooltipItem<"matrix">) => {
            const value = (ctx.raw as { v: number } | undefined)?.v ?? 0;
            return `Transactions: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Hourly Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <Chart type="matrix" data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};
