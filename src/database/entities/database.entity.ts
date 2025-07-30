import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('kms')
export class Kms {
    
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({ type:'double precision'})
    km: number;

    @Column({ type: 'double precision' })
    latitude: number;

    @Column({ type: 'double precision' })
    longitude: number;

    @Column({ type: 'int' })
    lineId: number;
    
    @OneToMany(()=>KmCordinates, (cordinates)=> cordinates.kms, {cascade: true ,onDelete: 'CASCADE'})
    cordinates: KmCordinates[];
}

@Entity('km_cordinates')
export class KmCordinates {

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @ManyToOne(()=>Kms, (kms)=> kms.cordinates, {onDelete: 'CASCADE'})
    @JoinColumn({ name: "kms_id" })
    kms: Kms;

    @Column({ type: 'double precision' })
    latitude: number;

    @Column({ type: 'double precision' })
    longitude: number;
}