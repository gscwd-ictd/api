import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class DatabaseEntity {
  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export const generateMetadata = <T extends DatabaseEntity>(data: T) => {
  // initialize metadata with null values
  const metadata = { createdAt: null, updatedAt: null };

  // transform the result with createdAt and updatedAt as new metadata values
  return (({ createdAt, updatedAt, ...rest }) => ({ ...rest, metadata: { ...metadata, createdAt, updatedAt } }))(data);
};
