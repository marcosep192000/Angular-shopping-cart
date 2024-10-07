export interface Client {
    id: number;
    cuit: string; 
	name: string;
	lastName?: string;
	birthday: string;
	address: string;
	tel: string;
	email: string;
	initialDate?: any;
	time?: any;
	status: boolean;
}
