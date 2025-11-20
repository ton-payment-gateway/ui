export interface IApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface IMerchant {
  id: string;
  name: string;
  webhookUrl: string;
  balance: number;
  withdrawableBalance: number;
  secretKey: string;
  createdAt: Date;
}
