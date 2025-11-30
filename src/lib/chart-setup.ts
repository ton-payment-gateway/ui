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
import { FunnelController, TrapezoidElement } from "chartjs-chart-funnel";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";

ChartJS.register(
  MatrixController,
  MatrixElement,
  LinearScale,
  CategoryScale,
  FunnelController,
  TrapezoidElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Title
);
