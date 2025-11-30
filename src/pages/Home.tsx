import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IApiResponse, IMerchant } from "@/lib/types";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface IPagination {
  total: number;
  page: number;
}

const PER_PAGE = 10;

const Home = () => {
  const navigate = useNavigate();

  const [merchants, setMerchants] = useState<IMerchant[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [merchantName, setMerchantName] = useState("");
  const [merchantWebhook, setMerchantWebhook] = useState("");

  useEffect(() => {
    const fetchMerchants = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<
          IApiResponse<{ result: IMerchant[]; pagination: IPagination }>
        >(`/merchant?page=${pagination.page}&limit=${PER_PAGE}`);
        console.log(response.data);
        setMerchants(response.data.data.result);
        setPagination(response.data.data.pagination);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, [pagination.page]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-6">Your Merchants</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="cursor-pointer">
              Add Merchant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Update merchant settings below.
              </DialogDescription>
            </DialogHeader>

            <Label htmlFor="merchantName">Merchant Name</Label>
            <Input
              id="merchantName"
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
            />

            <Label htmlFor="merchantWebhook" className="mt-4">
              Webhook URL
            </Label>
            <Input
              id="merchantWebhook"
              type="text"
              value={merchantWebhook}
              onChange={(e) => setMerchantWebhook(e.target.value)}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  onClick={() => {
                    api
                      .post<IApiResponse<IMerchant>>(`/merchant`, {
                        name: merchantName,
                        webhookUrl: merchantWebhook || null,
                      })
                      .then((res) => {
                        toast.success("Merchant created successfully");
                        navigate(`/merchants/${res.data.data.id}`);
                      })
                      .catch(() => {
                        toast.error("Failed to create merchant");
                      });
                  }}
                >
                  Create Merchant
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {merchants.length === 0 ? (
              <tr>
                <td colSpan={2} className="h-24 text-center">
                  No merchants found.
                </td>
              </tr>
            ) : (
              merchants.map((merchant) => (
                <tr
                  key={merchant.id}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/merchants/${merchant.id}`)}
                >
                  <td className="p-4 text-left">
                    <a
                      href={`/merchants/${merchant.id}`}
                      className="hover:underline"
                    >
                      {merchant.name}
                    </a>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground text-left">
                    {new Date(merchant.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * PER_PAGE + 1} to{" "}
          {Math.min(pagination.page * PER_PAGE, pagination.total)} of{" "}
          {pagination.total} merchants
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            disabled={pagination.page === 1}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            disabled={pagination.page * PER_PAGE >= pagination.total}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
