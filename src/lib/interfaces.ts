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
	score: number;
	participants: Participant[];
	voting: boolean;
	votes: { [key: string]: number };
}

export interface RoomMap {
	[key: string]: Room;
}
