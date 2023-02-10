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

export type ItemDetails = Pick<Item, 'id' | 'code' | 'category'> & {
  characteristic: string;
  classification: string;
  specifications: Omit<RawItemSpecification, 'reorderPoint' | 'reorderQuantity'> & {
    unit: string;
    reorder: {
      point: number;
      quantity: number;
    };
  };
  meta: Pick<RawItem, 'createdAt' | 'updatedAt'>;
};

export type UnitDetails = Pick<RawUnitOfMeasure, 'name' | 'symbol'> & {
  type: string;
};

export type ItemSummary = {
  id: string;
  code: string;
  classification: string;
  item: string;
  details: string;
  description: string;
};

export type ItemInformation = Pick<ItemSummary, 'id' | 'code' | 'classification'> &
  Pick<ItemDetails, 'meta'> & {
    characteristic: string;
    specifications: {
      item: string;
      details: string;
      description: string;
      balance: string;
      reorder: {
        point: number;
        quantity: number;
      };
    };
  };
