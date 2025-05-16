import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Bot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  strategy!: string;

  @Column('jsonb')
  config!: Record<string, any>;

  @Column()
  status!: 'running' | 'stopped' | 'paused' | 'error';

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user: User) => user.bots)
  user!: User;

  @Column('jsonb', { nullable: true })
  performance?: {
    totalPnL: number;
    dailyPnL: number;
    winRate: number;
    totalTrades: number;
  };

  @Column('jsonb', { nullable: true })
  riskMetrics?: {
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
