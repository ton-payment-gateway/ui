import { Check, Copy } from "lucide-react";
import type { IApiResponse, IMerchant } from "@/lib/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AnalyticsItem from "@/components/AnalyticsItem";
import { Button } from "@/components/ui/button";
import NotFound from "@/components/NotFound";
import api from "@/lib/api";

const Merchant = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [merchant, setMerchant] = useState<IMerchant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [gmvData, setGmvData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
  } | null>(null);
  const [serviceFeeData, setServiceFeeData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
  } | null>(null);
  const [crData, setCrData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
  } | null>(null);
  const [averageConfirmationTimeData, setAverageConfirmationTimeData] =
    useState<{
      kpi: number;
      labels: string[];
      data: number[];
    } | null>(null);
  const [p95ConfirmationTimeData, setP95ConfirmationTimeData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
  } | null>(null);
  const [directDepositShareData, setDirectDepositShareData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
  } | null>(null);
  const [aovData, setAovData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
  } | null>(null);
  const [repeatCustomerRateData, setRepeatCustomerRateData] = useState<{
    kpi: number;
    labels: string[];
    data: number[];
  } | null>(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<IApiResponse<IMerchant>>(
          `/merchant/${id}`
        );
        setMerchant(response.data.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchant();
  }, [id]);

  useEffect(() => {
    const fetchGmvData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/merchant/${id}/gmv?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; gmv: number }[]>
      >(
        `/merchant/${id}/gmv/chart?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      setGmvData({
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.gmv),
      });
    };

    fetchGmvData();
  }, [id]);

  useEffect(() => {
    const fetchServiceFeeData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/merchant/${id}/service-fee?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; serviceFee: number }[]>
      >(
        `/merchant/${id}/service-fee/chart?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      setServiceFeeData({
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.serviceFee),
      });
    };

    fetchServiceFeeData();
  }, [id]);

  useEffect(() => {
    const fetchCrData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/merchant/${id}/cr?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; conversionRate: number }[]>
      >(
        `/merchant/${id}/cr/chart?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      setCrData({
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.conversionRate),
      });
    };

    fetchCrData();
  }, [id]);

  useEffect(() => {
    const fetchAverageConfirmationTimeData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/merchant/${id}/average-confirmation-time?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; averageConfirmationTime: number }[]>
      >(
        `/merchant/${id}/average-confirmation-time/chart?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      setAverageConfirmationTimeData({
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
      });
    };

    fetchAverageConfirmationTimeData();
  }, [id]);

  useEffect(() => {
    const fetchP95ConfirmationTimeData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/merchant/${id}/p95-confirmation-time?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; p95ConfirmationTime: number }[]>
      >(
        `/merchant/${id}/p95-confirmation-time/chart?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      setP95ConfirmationTimeData({
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.p95ConfirmationTime),
      });
    };

    fetchP95ConfirmationTimeData();
  }, [id]);

  useEffect(() => {
    const fetchDirectDepositShareData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/merchant/${id}/direct-deposit-share?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; directDepositShare: number }[]>
      >(
        `/merchant/${id}/direct-deposit-share/chart?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      setDirectDepositShareData({
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.directDepositShare),
      });
    };

    fetchDirectDepositShareData();
  }, [id]);

  useEffect(() => {
    const fetchAovData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/merchant/${id}/aov?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; averageOrderValue: number }[]>
      >(
        `/merchant/${id}/aov/chart?startDate=${encodeURIComponent(
          "2025-11-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      setAovData({
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        data: chartResponse.data.data.map((item) => item.averageOrderValue),
      });
    };

    fetchAovData();
  }, [id]);

  useEffect(() => {
    const fetchRepeatCustomerRateData = async () => {
      const kpiResponse = await api.get<IApiResponse<number>>(
        `/merchant/${id}/repeat-customer-rate?startDate=${encodeURIComponent(
          "2025-01-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      const chartResponse = await api.get<
        IApiResponse<{ date: string; repeatCustomerRate: number }[]>
      >(
        `/merchant/${id}/repeat-customer-rate/chart?startDate=${encodeURIComponent(
          "2025-01-01T00:00:00.000Z"
        )}&endDate=${encodeURIComponent("2025-11-16T00:00:00.000Z")}`
      );

      setRepeatCustomerRateData({
        kpi: kpiResponse.data.data,
        labels: chartResponse.data.data
          .filter((item) => item.repeatCustomerRate > 0)
          .map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          ),
        data: chartResponse.data.data
          .filter((item) => item.repeatCustomerRate > 0)
          .map((item) => item.repeatCustomerRate),
      });
    };

    fetchRepeatCustomerRateData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!merchant) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ← Back
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800">
          Settings
        </button>
      </div>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{merchant.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="mt-1 text-sm">{merchant.id}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={async () => {
                await navigator.clipboard.writeText(merchant.id);
                setCopiedId(true);
                setTimeout(() => setCopiedId(false), 2000);
              }}
            >
              {copiedId ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Created At
            </p>
            <p className="mt-1 text-sm">
              {new Date(merchant.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Balance</p>
            <p className="mt-1 text-sm">{merchant.balance} TON</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Withdrawable Balance
            </p>
            <p className="mt-1 text-sm">{merchant.withdrawableBalance} TON</p>
          </div>
          <div className="flex items-center justify-between md:col-span-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Webhook URL
              </p>
              <p className="mt-1 text-sm font-mono break-all">
                {merchant.webhookUrl || "Not set"}
              </p>
            </div>
            {merchant.webhookUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={async () => {
                  await navigator.clipboard.writeText(merchant.webhookUrl);
                  setCopiedWebhook(true);
                  setTimeout(() => setCopiedWebhook(false), 2000);
                }}
              >
                {copiedWebhook ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            <Button>Withdraw</Button>
            <Button variant="default">Collect TON to Main Address</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Gross Market Value</h3>
            <AnalyticsItem
              kpi={gmvData?.kpi || 0}
              labels={gmvData?.labels || []}
              data={gmvData?.data || []}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Service Fee</h3>

            <AnalyticsItem
              kpi={serviceFeeData?.kpi || 0}
              labels={serviceFeeData?.labels || []}
              data={serviceFeeData?.data || []}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Conversion Rate</h3>
            <AnalyticsItem
              kpi={crData?.kpi || 0}
              labels={crData?.labels || []}
              data={crData?.data || []}
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
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">P95 Confirmation Time</h3>
            <AnalyticsItem
              kpi={p95ConfirmationTimeData?.kpi || 0}
              labels={p95ConfirmationTimeData?.labels || []}
              data={p95ConfirmationTimeData?.data || []}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Direct Deposit Share</h3>
            <AnalyticsItem
              kpi={directDepositShareData?.kpi || 0}
              labels={directDepositShareData?.labels || []}
              data={directDepositShareData?.data || []}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Average Order Value</h3>
            <AnalyticsItem
              kpi={aovData?.kpi || 0}
              labels={aovData?.labels || []}
              data={aovData?.data || []}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Repeat Customer Rate</h3>
            <AnalyticsItem
              kpi={repeatCustomerRateData?.kpi || 0}
              labels={repeatCustomerRateData?.labels || []}
              data={repeatCustomerRateData?.data || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchant;
