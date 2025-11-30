import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import AnalyticsItem from "@/components/AnalyticsItem";
import type { IApiResponse } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  TransactionsTable,
  type ITransaction,
} from "@/components/TransactionsTable";
import api from "@/lib/api";
import { toast } from "sonner";

const EForecastModel = {
  HoltWinters: "holt_winters",
  Sarima: "sarima",
  Prophet: "prophet",
} as const;

type EForecastModel = (typeof EForecastModel)[keyof typeof EForecastModel];

const MODELS_OPTIONS = [
  { value: EForecastModel.HoltWinters, label: "Holt-Winters" },
  { value: EForecastModel.Sarima, label: "SARIMA" },
  { value: EForecastModel.Prophet, label: "Prophet" },
];

const Dashboard = () => {
  const [alerts, setAlerts] = useState<string[]>([]);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  );
  const [endDate, setEndDate] = useState(new Date().toISOString());

  const [gmvData, setGmvData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
    forecastLabels?: string[];
    forecastData?: number[];
  } | null>(null);
  const [serviceFeeData, setServiceFeeData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
    forecastLabels?: string[];
    forecastData?: number[];
  } | null>(null);
  const [crData, setCrData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
    forecastLabels?: string[];
    forecastData?: number[];
  } | null>(null);
  const [averageConfirmationTimeData, setAverageConfirmationTimeData] =
    useState<{
      kpi: number;
      labels: string[];
      data: number[];
      forecastLabels?: string[];
      forecastData?: number[];
    } | null>(null);
  const [p95ConfirmationTimeData, setP95ConfirmationTimeData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
    forecastLabels?: string[];
    forecastData?: number[];
  } | null>(null);
  const [directDepositShareData, setDirectDepositShareData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
    forecastLabels?: string[];
    forecastData?: number[];
  } | null>(null);
  const [activeMerchantsData, setActiveMerchantsData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
    forecastLabels?: string[];
    forecastData?: number[];
  } | null>(null);

  const [slowestTransactionsAmount, setSlowestTransactionsAmount] = useState(5);
  const [slowestTransactions, setSlowestTransactions] = useState<
    ITransaction[]
  >([]);

  const [forecastEnabled, setForecastEnabled] = useState(false);
  const [predictionModel, setPredictionModel] = useState<EForecastModel>(
    EForecastModel.Prophet
  );
  const [forecastHorizon, setForecastHorizon] = useState(7);

  useEffect(() => {
    const fetchAlerts = async () => {
      const response = await api.get<IApiResponse<string[]>>(`/admin/alerts`);

      setAlerts(response.data.data);
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    const fetchGmvData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/admin/gmv?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; gmv: number }[]>
      >(
        `/admin/gmv/chart?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const result: {
        kpi: number;
        labels: string[];
        data: number[];
        forecastLabels?: string[];
        forecastData?: number[];
      } = {
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.gmv),
      };

      if (forecastEnabled) {
        try {
          const forecastResponse = await api.get<
            IApiResponse<{ date: string; gmv: number }[]>
          >(
            `/admin/gmv/forecast?model=${predictionModel}&horizon=${forecastHorizon}`
          );

          result.forecastLabels = forecastResponse.data.data.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          result.forecastData = forecastResponse.data.data.map(
            (item) => item.gmv
          );
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch GMV forecast data");
        }
      }

      setGmvData(result);
    };

    fetchGmvData();
  }, [startDate, endDate, forecastEnabled, predictionModel, forecastHorizon]);

  useEffect(() => {
    const fetchServiceFeeData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/admin/service-fee?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; serviceFee: number }[]>
      >(
        `/admin/service-fee/chart?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const result: {
        kpi: number;
        labels: string[];
        data: number[];
        forecastLabels?: string[];
        forecastData?: number[];
      } = {
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.serviceFee),
      };

      if (forecastEnabled) {
        try {
          const forecastResponse = await api.get<
            IApiResponse<{ date: string; serviceFee: number }[]>
          >(
            `/admin/service-fee/forecast?model=${predictionModel}&horizon=${forecastHorizon}`
          );

          result.forecastLabels = forecastResponse.data.data.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          result.forecastData = forecastResponse.data.data.map(
            (item) => item.serviceFee
          );
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch service fee forecast data");
        }
      }

      setServiceFeeData(result);
    };

    fetchServiceFeeData();
  }, [startDate, endDate, forecastEnabled, predictionModel, forecastHorizon]);

  useEffect(() => {
    const fetchCrData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/admin/cr?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; conversionRate: number }[]>
      >(
        `/admin/cr/chart?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const result: {
        kpi: number;
        labels: string[];
        data: number[];
        forecastLabels?: string[];
        forecastData?: number[];
      } = {
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.conversionRate),
      };

      if (forecastEnabled) {
        try {
          const forecastResponse = await api.get<
            IApiResponse<{ date: string; conversionRate: number }[]>
          >(
            `/admin/cr/forecast?model=${predictionModel}&horizon=${forecastHorizon}`
          );

          result.forecastLabels = forecastResponse.data.data.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          result.forecastData = forecastResponse.data.data.map(
            (item) => item.conversionRate
          );
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch conversion rate forecast data");
        }
      }

      setCrData(result);
    };

    fetchCrData();
  }, [startDate, endDate, forecastEnabled, predictionModel, forecastHorizon]);

  useEffect(() => {
    const fetchAverageConfirmationTimeData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/admin/average-confirmation-time?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; averageConfirmationTime: number }[]>
      >(
        `/admin/average-confirmation-time/chart?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const result: {
        kpi: number;
        labels: string[];
        data: number[];
        forecastLabels?: string[];
        forecastData?: number[];
      } = {
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map(
          (item) => item.averageConfirmationTime
        ),
      };

      if (forecastEnabled) {
        try {
          const forecastResponse = await api.get<
            IApiResponse<{ date: string; averageConfirmationTime: number }[]>
          >(
            `/admin/average-confirmation-time/forecast?model=${predictionModel}&horizon=${forecastHorizon}`
          );

          result.forecastLabels = forecastResponse.data.data.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          result.forecastData = forecastResponse.data.data.map(
            (item) => item.averageConfirmationTime
          );
        } catch (error) {
          console.log(error);
          toast.error(
            "Failed to fetch average confirmation time forecast data"
          );
        }
      }

      setAverageConfirmationTimeData(result);
    };

    fetchAverageConfirmationTimeData();
  }, [startDate, endDate, forecastEnabled, predictionModel, forecastHorizon]);

  useEffect(() => {
    const fetchP95ConfirmationTimeData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/admin/p95-confirmation-time?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; p95ConfirmationTime: number }[]>
      >(
        `/admin/p95-confirmation-time/chart?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const result: {
        kpi: number;
        labels: string[];
        data: number[];
        forecastLabels?: string[];
        forecastData?: number[];
      } = {
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.p95ConfirmationTime),
      };

      if (forecastEnabled) {
        try {
          const forecastResponse = await api.get<
            IApiResponse<{ date: string; p95ConfirmationTime: number }[]>
          >(
            `/admin/p95-confirmation-time/forecast?model=${predictionModel}&horizon=${forecastHorizon}`
          );

          result.forecastLabels = forecastResponse.data.data.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          result.forecastData = forecastResponse.data.data.map(
            (item) => item.p95ConfirmationTime
          );
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch p95 confirmation time forecast data");
        }
      }

      setP95ConfirmationTimeData(result);
    };

    fetchP95ConfirmationTimeData();
  }, [startDate, endDate, forecastEnabled, predictionModel, forecastHorizon]);

  useEffect(() => {
    const fetchDirectDepositShareData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/admin/direct-deposit-share?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; directDepositShare: number }[]>
      >(
        `/admin/direct-deposit-share/chart?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const result: {
        kpi: number;
        labels: string[];
        data: number[];
        forecastLabels?: string[];
        forecastData?: number[];
      } = {
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.directDepositShare),
      };

      if (forecastEnabled) {
        try {
          const forecastResponse = await api.get<
            IApiResponse<{ date: string; directDepositShare: number }[]>
          >(
            `/admin/direct-deposit-share/forecast?model=${predictionModel}&horizon=${forecastHorizon}`
          );

          result.forecastLabels = forecastResponse.data.data.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          result.forecastData = forecastResponse.data.data.map(
            (item) => item.directDepositShare
          );
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch direct deposit share forecast data");
        }
      }

      setDirectDepositShareData(result);
    };

    fetchDirectDepositShareData();
  }, [startDate, endDate, forecastEnabled, predictionModel, forecastHorizon]);

  useEffect(() => {
    const fetchActiveMerchantsData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/admin/active-merchants?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; activeMerchants: number }[]>
      >(
        `/admin/active-merchants/chart?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      const result: {
        kpi: number;
        labels: string[];
        data: number[];
        forecastLabels?: string[];
        forecastData?: number[];
      } = {
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.activeMerchants),
      };

      if (forecastEnabled) {
        try {
          const forecastResponse = await api.get<
            IApiResponse<{ date: string; activeMerchants: number }[]>
          >(
            `/admin/active-merchants/forecast?model=${predictionModel}&horizon=${forecastHorizon}`
          );

          result.forecastLabels = forecastResponse.data.data.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          result.forecastData = forecastResponse.data.data.map(
            (item) => item.activeMerchants
          );
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch active merchants forecast data");
        }
      }

      setActiveMerchantsData(result);
    };

    fetchActiveMerchantsData();
  }, [startDate, endDate, forecastEnabled, predictionModel, forecastHorizon]);

  useEffect(() => {
    const fetchSlowestTransactions = async () => {
      const response = await api.get<IApiResponse<ITransaction[]>>(
        `/admin/slowest-transactions?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(
          endDate
        )}&top=${slowestTransactionsAmount}`
      );

      setSlowestTransactions(response.data.data);
    };

    fetchSlowestTransactions();
  }, [startDate, endDate, slowestTransactionsAmount]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      </div>

      {alerts.length > 0 && (
        <div className="bg-card rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Alerts</h2>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <div className="shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
                  <span className="text-destructive text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-destructive flex-1">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col gap-4 mb-6 ml-auto mr-auto w-fit items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableForecast"
              checked={forecastEnabled}
              onCheckedChange={setForecastEnabled}
            />
            <Label htmlFor="enableForecast">Enable Forecast</Label>
          </div>

          {forecastEnabled && (
            <div className="flex gap-4">
              <div>
                <Label htmlFor="predictionModel" className="mb-1">
                  Prediction Model
                </Label>

                <Select
                  value={predictionModel}
                  onValueChange={(value) =>
                    setPredictionModel(value as EForecastModel)
                  }
                >
                  <SelectTrigger id="predictionModel">
                    <SelectValue placeholder="Select a prediction model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Model</SelectLabel>
                      {MODELS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="forecastHorizon" className="mb-1">
                  Forecast Horizon (days)
                </Label>
                <Input
                  id="forecastHorizon"
                  type="number"
                  min={1}
                  max={365}
                  value={forecastHorizon}
                  onChange={(e) => setForecastHorizon(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-6 ml-auto mr-auto w-fit">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate.split("T")[0]}
              onChange={(e) => setStartDate(e.target.value + "T00:00:00Z")}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate.split("T")[0]}
              onChange={(e) => setEndDate(e.target.value + "T23:59:59Z")}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">
            TOP {slowestTransactionsAmount} Slowest Transactions
          </h3>
          <div className="mb-4 w-fit ml-auto mr-auto">
            <Label
              htmlFor="slowestTransactionsAmount"
              className="mb-1 text-nowrap"
            >
              Number of Transactions
            </Label>
            <Input
              id="slowestTransactionsAmount"
              type="number"
              min={1}
              max={100}
              value={slowestTransactionsAmount}
              onChange={(e) =>
                setSlowestTransactionsAmount(Number(e.target.value))
              }
            />
          </div>
          <TransactionsTable transactions={slowestTransactions} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Gross Market Value</h3>
            <AnalyticsItem
              kpi={gmvData?.kpi || 0}
              labels={gmvData?.labels || []}
              data={gmvData?.data || []}
              forecastLabels={gmvData?.forecastLabels || []}
              forecastData={gmvData?.forecastData || []}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Service Fee</h3>

            <AnalyticsItem
              kpi={serviceFeeData?.kpi || 0}
              labels={serviceFeeData?.labels || []}
              data={serviceFeeData?.data || []}
              forecastLabels={serviceFeeData?.forecastLabels}
              forecastData={serviceFeeData?.forecastData}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Conversion Rate</h3>
            <AnalyticsItem
              kpi={crData?.kpi || 0}
              labels={crData?.labels || []}
              data={crData?.data || []}
              forecastLabels={crData?.forecastLabels}
              forecastData={crData?.forecastData}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">
              Average Confirmation Time
            </h3>
            <AnalyticsItem
              kpi={averageConfirmationTimeData?.kpi || 0}
              labels={averageConfirmationTimeData?.labels || []}
              data={averageConfirmationTimeData?.data || []}
              forecastLabels={averageConfirmationTimeData?.forecastLabels}
              forecastData={averageConfirmationTimeData?.forecastData}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">P95 Confirmation Time</h3>
            <AnalyticsItem
              kpi={p95ConfirmationTimeData?.kpi || 0}
              labels={p95ConfirmationTimeData?.labels || []}
              data={p95ConfirmationTimeData?.data || []}
              forecastLabels={p95ConfirmationTimeData?.forecastLabels}
              forecastData={p95ConfirmationTimeData?.forecastData}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Direct Deposit Share</h3>
            <AnalyticsItem
              kpi={directDepositShareData?.kpi || 0}
              labels={directDepositShareData?.labels || []}
              data={directDepositShareData?.data || []}
              forecastLabels={directDepositShareData?.forecastLabels}
              forecastData={directDepositShareData?.forecastData}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Active Merchants</h3>
            <AnalyticsItem
              kpi={activeMerchantsData?.kpi || 0}
              labels={activeMerchantsData?.labels || []}
              data={activeMerchantsData?.data || []}
              forecastLabels={activeMerchantsData?.forecastLabels}
              forecastData={activeMerchantsData?.forecastData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
