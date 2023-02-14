import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { nullable: true })
  first_name: string;

  @Column("varchar", { nullable: true })
  last_name: string;

  @Column("varchar", { nullable: true })
  email: string;

  @Column("varchar", { nullable: true })
  country_code: string;

  @Column("varchar", { nullable: true })
  phone: string;

  @Column("varchar", { nullable: true })
  password: string;

  @Column("date")
  @CreateDateColumn()
  created_at: Date;

  @Column("date")
  @UpdateDateColumn()
  updated_at: Date;

  @Column("date")
  @DeleteDateColumn()
  deleted_at: Date;
}
