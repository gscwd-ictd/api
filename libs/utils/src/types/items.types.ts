export type RawItem = {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RawItemSpecification = Omit<RawItem, 'name'> & {
  details: string;
  quantity: number;
  reorderPoint: number;
  reorderQuantity: number;
};

export type RawUnitType = {
  id: string;
  type: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RawUnitOfMeasure = {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Item = Omit<RawItem, 'name' | 'createdAt' | 'updatedAt'> &
  Pick<RawItemSpecification, 'details'> & {
    category: string;
  };

export type ItemDetails = Pick<Item, 'id' | 'code' | 'category'> &
  Pick<RawItem, 'createdAt' | 'updatedAt'> & {
    characteristic: string;
    classification: string;
    specifications: Omit<RawItemSpecification, 'reorderPoint' | 'reorderQuantity'> & {
      unit: string;
      reorder: {
        point: number;
        quantity: number;
      };
    };
  };

export type UnitDetails = Pick<RawUnitOfMeasure, 'name' | 'symbol'> & {
  type: string;
};

export type ItemInformation = {
  id: string;
  code: string;
  classification: string;
  item: string;
  details: string;
  description: string;
};

export type ItemSummary = ItemInformation & {
  balance: number;
  unit: string;
  reorder: {
    point: number;
    quantity: number;
  };
};

export type ItemBalance = {
  code: string;
  item: string;
  details: string;
  balance: number;
};
