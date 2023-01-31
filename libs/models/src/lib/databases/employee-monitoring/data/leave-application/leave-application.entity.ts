import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LeaveBenefits } from '../leave-benefits/leave-benefits.entity';
import { LeaveApplicationStatus } from '@gscwd-api/utils';

@Entity('leave_application')
export class LeaveApplication extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_application_id' })
  id: string;

  @OneToMany(() => LeaveBenefits, (leaveBenefits) => leaveBenefits.id)
  leaveBenefits: LeaveBenefits;

  @Column({ name: 'date_of_filing' })
  dateOfFiling: Date;

  @Column({ name: 'in_philippines', nullable: true })
  inPhilippines: string;

  @Column({ name: 'abroad', nullable: true })
  abroad: string;

  @Column({ name: 'in_hospital', nullable: true })
  inHospital: string;

  @Column({ name: 'out_hospital', nullable: true })
  outHospital: string;

  @Column({ name: 'spl_women', nullable: true })
  splWomen: string;

  @Column({ name: 'for_masters_completion', type: 'bool' })
  forMastersCompletion: boolean;

  @Column({ name: 'for_bar_board_review', type: 'bool' })
  forBarBoardReview: boolean;

  @Column({ name: 'study_leave_other' })
  studyLeaveOther: string;

  @Column({ type: 'bool' })
  forMonetization: boolean;

  @Column({ name: 'is_terminal_leave', type: 'bool' })
  isTerminalLeave: boolean;

  @Column({ type: 'bool' })
  requestedCommutation: boolean;

  @Column({ type: 'enum', enum: LeaveApplicationStatus, default: LeaveApplicationStatus.ONGOING })
  status: LeaveApplicationStatus;
}
