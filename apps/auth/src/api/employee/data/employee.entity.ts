import { DatabaseEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user';

@Entity('employees')
export class Employee extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'employee_id' })
  employeeId: string;

  @OneToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id_fk' })
  userId: string;

  @Column({ name: 'first_name', length: 80 })
  firstName: string;

  @Column({ name: 'middle_name', length: 50, nullable: true })
  middleName: string;

  @Column({ name: 'last_name', length: 80 })
  lastName: string;

  @Column({ name: 'name_extension', length: 5, nullable: true })
  nameExt: string;

  @Column({ length: 5, default: 'Male' })
  sex: 'Male' | 'Female';

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'mobile_number', nullable: true })
  mobileNumber: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;
}
