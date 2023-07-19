import { get } from 'svelte/store';
import type {
	LocalState,
	ManagedState,
	Participant,
	RoomState,
	RoomSync,
	UserUpdate,
	UserVote
} from './interfaces';
import { RealtimeChannelHandler } from './realtime';
import { user } from './stores/user';
import { stateStore, type StateStore } from './stores/state';

/**
 * what needs to happen in rooms?
 *  [x] voting
 *  [x] user updates
 *
 * vote triggers:
 *  [ ] abstaining/not
 *  [ ] tally
 *  [ ] reset
 *
 * user updates:
 *  [x] join
 *  [x] leave
 *  [x] name change
 *  [ ] color change
 *  [ ] abstain
 *  [ ] vote
 */
export class RoomImpl {
	private channelHandler: RealtimeChannelHandler;
	private userId: string;

	public managedState: StateStore;

	constructor(roomId: string, initUser: Participant) {
		this.userId = initUser.id;

		// instantiate channel handler
		this.channelHandler = new RealtimeChannelHandler(roomId, initUser, false);

		this.managedState = stateStore();

		// subscribe to events
		this.channelHandler
			// state sync (voting)
			.handleBroadcastEvent<RoomSync>('roomSync', (state) => {
				console.log('room sync', state);
				this.sync(state);
			})
			// transmit vote
			.handleBroadcastEvent<UserVote>('userVote', ({ userId, vote }) => {
				console.log('user vote', userId, vote);
				this.channelHandler.users().updateUser(userId, { vote: vote });
			})
			// name change, color change, abstain
			.handleBroadcastEvent<UserUpdate>('userUpdate', (payload) => {
				console.log('user update', payload);
				this.channelHandler.users().updateUser(payload.userId, payload);
			})
			// name change, color change, abstain
			.handleBroadcastEvent('startVote', () => {
				if (true) {
					user.update((state) => {
						state.vote = -1;
						return state;
					});
				}
				this.managedState.updateState({ voting: true });
			})
			// name change, color change, abstain
			.handleBroadcastEvent('tally', () => {
				// this is when we tally

				const userList = Object.values(get(this.channelHandler.users()));
				const newTally = userList.reduce((sum, current) => sum + current, 0) / userList.length;

				this.managedState.updateState({ tally: newTally, voting: false });
			});
	}

	/**
	 * sync the room state with peers
	 * right now it's just voting status
	 * @param roomState state of the room
	 */
	private sync(roomState: RoomState) {
		this.managedState.updateState(roomState);
	}

	/**
	 * update the current user
	 * @param user current user w/updates
	 */
	public updateCurrentUser(user: Participant) {
		this.channelHandler.updateSelf(user);
	}

	/**
	 * Broadcast room state to peers
	 * useful for syncing non-default state with new users
	 */
	public triggerSync() {
		this.channelHandler.broadcastEvent<RoomSync>('roomSync', {
			userId: this.userId,
			voting: get(this.managedState).voting,
			name: get(this.managedState).name
		});
	}

	/**
	 * Broadcasts vote to peers
	 * @param vote vote on a given issue
	 */
	public sendVote(vote: number) {
		// this.channelHandler.updateSelf;
		//TODO gotta like. update the user store.
		this.channelHandler.broadcastEvent<UserVote>('userVote', {
			userId: this.userId,
			vote: vote
		});
	}

	/**
	 * Toggle abstaining state and broadcast to peers
	 */
	public toggleAbstain() {
		this.channelHandler.updateSelf({
			id: this.userId,
			abstaining: !get(user).abstaining
		});
	}

	/**
	 *  Toggle the room's voting status
	 */
	public toggleVoting() {
		this.managedState.updateState({ voting: !get(this.managedState).voting });

		console.log('toggling voting', get(this.managedState).voting);
		if (!get(this.managedState).voting && !get(this.managedState).resetVote) {
			this.managedState.updateState({ tally: 0 });
		}
	}

	/**
	 * Unsubscribe from the channel/leave room
	 */
	public leave() {
		this.channelHandler.leaveChannel();
	}

	public state(): StateStore {
		return this.managedState;
	}

	public users() {
		return this.channelHandler.users();
	}
}
