import { get } from 'svelte/store';
import type {
	LocalState,
	Participant,
	RoomState,
	RoomSync,
	UserUpdate,
	UserVote
} from './interfaces';
import { RealtimeChannelHandler } from './realtime';
import { user } from './stores/user';

/**
 * what needs to happen in rooms?
 *  [ ] voting
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
	private selfEvents: boolean;
	private userId: string;

	public localSettings: LocalState;

	public roomState: RoomState;

	constructor(roomId: string, initUser: Participant, selfEvents: boolean) {
		this.selfEvents = selfEvents;
		this.userId = initUser.id;

		// instantiate channel handler
		this.channelHandler = new RealtimeChannelHandler(roomId, initUser, false);

		this.roomState = {
			voting: false,
			name: roomId
		};

		this.localSettings = {
			tally: 0,
			resetVote: false
		};

		// subscribe to events
		this.channelHandler
			// state sync (voting)
			.handleBroadcastEvent<RoomSync>('roomSync', (state) => {
				this.sync(state);
			})
			// transmit vote
			.handleBroadcastEvent<UserVote>('userVote', ({ userId, vote }) => {
				this.channelHandler.users().updateUser(userId, { vote: vote });
			})
			// name change, color change, abstain
			.handleBroadcastEvent<UserUpdate>('userUpdate', (payload) => {
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
				this.roomState.voting = true;
			})
			// name change, color change, abstain
			.handleBroadcastEvent('tally', () => {
				// this is when we tally
				this.roomState.voting = false;

				const userList = Object.values(get(this.channelHandler.users()));
				this.localSettings.tally =
					userList.reduce((sum, current) => sum + current, 0) / userList.length;
			});
	}

	/**
	 * sync the room state with peers
	 * right now it's just voting status
	 * @param roomState state of the room
	 */
	private sync(roomState: RoomState) {
		this.roomState = roomState;
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
			voting: this.roomState.voting,
			name: this.roomState.name
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
		this.roomState.voting = !this.roomState.voting;
		if (!this.roomState.voting) {
			this.localSettings.tally = 0;
		}
	}

	/**
	 * Unsubscribe from the channel/leave room
	 */
	public leave() {
		this.channelHandler.leaveChannel();
	}

	public state(): RoomState & LocalState {
		return { ...this.roomState, ...this.localSettings };
	}

	public users() {
		return this.channelHandler.users();
	}
}
