const testState = {
	id: 'test',
	name: 'Test Room',
	admin: 'testu1',
	score: -1,
	voting: false,
	participants: [
		{
			id: 'testu1',
			name: 'Test User',
			color: '#3f3f3f',
			abstaining: false
		},
		{
			id: 'testu2',
			name: 'Test User 2',
			color: '#000000',
			abstaining: true
		},
		{
			id: 'testu3',
			name: 'Test User 3',
			color: '#3f7a5e',
			abstaining: false
		}
	],
	votes: {
		testu1: 5,
		testu2: 8,
		testu3: 0
	}
};
