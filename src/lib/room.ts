import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';
import type { Participant, RoomState, RoomSync, UserUpdate, UserVote } from './interfaces';
import { RealtimeChannelHandler } from './realtime';
import { stateStore, type StateStore } from './stores/state';
import { user, type UserMap } from './stores/user';

/**
 * room updates:
 *  [ ] name change
 *
 * vote triggers:
 *  [ ] tally
 *
 * user updates:
 *  [ ] name change
 *  [ ] color change
 *  [ ] vote
 */
export class RoomImpl {
	private channelHandler: RealtimeChannelHandler;
	private userId: string;

	private managedState: StateStore;

	constructor(roomId: string, initUser: Participant) {
		this.userId = initUser.id;

		// instantiate channel handler
		this.channelHandler = new RealtimeChannelHandler(roomId, initUser, false);

		this.managedState = stateStore();

		this.managedState.updateState({ name: roomId });

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
				if (get(this.managedState).resetVote) {
					user.update((state) => {
						state.vote = -1;
						return state;
					});
				}
				this.managedState.updateState({ voting: true });
			})
			// name change, color change, abstain
			.handleBroadcastEvent('tally', () => {
				// this is when we tally & end voting
				this.tally();
			});
	}

	/**
	 *
	 * @param score Helper to get modal settings
	 * @returns
	 */
	private static modalSettings = (score: number): ModalSettings => {
		return {
			type: 'alert',
			title: 'Results',
			body: score + '',
			buttonTextCancel: 'Neat!'
		};
	};

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
	public updateCurrentUser(user: Partial<Participant>) {
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
		this.channelHandler.users().updateUser(this.userId, { vote: vote });
		user.update((state) => {
			return { ...state, vote: vote };
		});
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
			abstaining: !get(user).abstaining,
			vote: -1
		});
	}

	/**
	 *  Toggle the room's voting status
	 */
	public toggleVoting() {
		this.managedState.updateState({ voting: !get(this.managedState).voting });

		if (!get(this.managedState).voting && !get(this.managedState).resetVote) {
			this.managedState.updateState({ tally: 0 });
		}

		if (get(this.managedState).voting) {
			this.channelHandler.broadcastEvent('startVote', { userId: this.userId });
		} else {
			this.channelHandler.broadcastEvent('tally', { userId: this.userId });
			this.tally();
		}
	}

	/**
	 * Trigger to tally & display votes
	 */
	private tally() {
		const userList = Array.from(get(this.channelHandler.users()).values());
		const newTally =
			userList.filter((p) => p.vote > 0).reduce((sum, current) => sum + current.vote, 0) /
			userList.length;

		this.managedState.updateState({ tally: newTally, voting: false });

		modalStore.trigger(RoomImpl.modalSettings(newTally));
	}

	/**
	 * Unsubscribe from the channel/leave room
	 */
	public leave(): void {
		this.channelHandler.leaveChannel();
	}

	/**
	 * get the state for the room
	 * @returns the state for this room
	 */
	public state(): StateStore {
		return this.managedState;
	}

	/**
	 * get a map of id:Participant for the users in the room
	 * @returns the user map for this room
	 */
	public users(): UserMap {
		return this.channelHandler.users();
	}
}
