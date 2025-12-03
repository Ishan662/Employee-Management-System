import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "../../permissions/permission.entitiy";

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];
}