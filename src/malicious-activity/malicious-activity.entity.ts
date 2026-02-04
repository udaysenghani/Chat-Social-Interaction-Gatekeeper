import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Message } from '../messages/message.entity';
import { User } from '../users/user.entity';

@Entity('malicious_activity')
export class MaliciousActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔗 Reference to the original message
  @Index()
  @Column('uuid')
  message_id: string;

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  // 🔗 Reference to the offending user
  @Index()
  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  incident_type: string;

  @Column({ type: 'float' })
  confidence: number;

  @CreateDateColumn()
  created_at: Date;
}
