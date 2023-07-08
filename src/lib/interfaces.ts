export interface Participant {
	id: string;
	name: string;
	color: string;
	abstaining: boolean;
}

export interface Room {
	id: string;
	name: string;
	admin: string;
	participants: Participant[];
	voting: boolean;
	votes: { [key: string]: number };
}
