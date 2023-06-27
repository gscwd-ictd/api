import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { NatureOfBusiness, ObTransportation } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pass_slip')
export class PassSlip extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pass_slip_id' })
  id: string;

  @Column({ name: 'employee_id_fk', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'date_of_application', type: 'date' })
  dateOfApplication: Date;

  @Column({ name: 'nature_of_business', type: 'enum', enum: NatureOfBusiness })
  natureOfBusiness: NatureOfBusiness;

  @Column({ name: 'ob_transportation', type: 'enum', enum: ObTransportation, nullable: true })
  obTransportation: ObTransportation;

  @Column({ name: 'estimate_hours', type: 'decimal', scale: 2, precision: 6, nullable: true })
  estimateHours: number;

  @Column({ name: 'purpose_destination', type: 'text' })
  purposeDestination: string;

  @Column({ name: 'is_cancelled', type: 'boolean' })
  isCancelled: boolean;

  @Column({ name: 'time_out', type: 'time', nullable: true })
  timeOut: number;

  @Column({ name: 'time_in', type: 'time', nullable: true })
  timeIn: number;
}
