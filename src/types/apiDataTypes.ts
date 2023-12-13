// Params and form data

export type FindAllOrderParams = {
  tab: 'prepare' | 'ordered' | 'upcoming' | string;
  limit: number;
  page: number;
  sort?: 'asc' | 'desc';
};

export type OrderHistoryParams = {
  startDate?: string | Date;
  endDate?: string | Date;
  limit: number;
  page: number;
  sort?: 'asc' | 'desc';
};

export type MenuItemParams = {
  limit: number;
  page: number;
  sort?: 'asc' | 'desc';
  _q?: string;
};
