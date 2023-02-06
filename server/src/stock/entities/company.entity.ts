import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../../models/base.entity';

@Entity({
	name: 'company'
})
export class CompanyEntity extends BaseModel {
	@PrimaryGeneratedColumn('increment', {
		type: 'integer'
	})
	company_id: number;

	@Column({
		type: 'text',
		default: ''
	})
	company_name: string;

	@Column({
		type: 'text',
		default: ''
	})
	logo: string;

	@Column({
		type: 'integer',
		default: 0
	})
	employees: number;

	@Column({
		type: 'text',
		default: ''
	})
	phone: string;

	@Column({
		type: 'text',
		default: ''
	})
	ceo: string;

	@Column({
		type: 'text',
		default: ''
	})
	website: string;

	@Column({
		type: 'text',
		default: [],
		array: true
	})
	industry: string[];

	@Column({
		type: 'text',
		default: ''
	})
	description: string;

	@Column({
		type: 'text',
		default: ''
	})
	tax_code: string;

	@Column({
		type: 'text',
		default: ''
	})
	address: string;

	@Column({
		type: 'date',
		default: '01/01/2023'
	})
	list_date: Date;

	@Column({
		type: 'smallint',
		default: 1
	})
	is_active: string;
}
