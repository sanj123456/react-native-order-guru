export type orderItemDataTypes = {
  _id: string;
  orderNum: number;
  customer: {
    name: string;
    email: string;
    phone: number;
    customerId: string;
  };
  status: string;
  method: string;
  payment: {
    total: number;
  };
  paymentMethod: string;
  paymentStatus: string;
  provider: {
    id: 'doordash' | 'grubhub' | 'postmates' | 'uber';
    name: string;
  };
  scheduledOn: string | null;
  orderTiming: string;
  orderNowPickupDate: string | null;
  readByTablet: boolean;
  ihdDeliveryId: boolean;
  partner: {
    _id: string;
    partner: {
      _id: string;
      name: string;
    };
  };
};

export type menuItemDataTypes = {
  imageUrl: string;
  name: string;
  status: boolean;
  _id: string;
  snoozedTill?: string;
};
