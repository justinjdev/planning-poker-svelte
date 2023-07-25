import type { RealtimeChannel, RealtimeChannelSendResponse } from '@supabase/supabase-js';
import { get } from 'svelte/store';
import type { BroadcastEvent, Participant, UserUpdate } from './interfaces';
import { eventStore, type EventStore } from './stores/event';
import { user, userMap, type UserMap } from './stores/user';
import { supabaseClient } from './supabase';

/**
 * Creates and manages a realtime channel
 * This class will handle user joins/leaves/and broadcast user changes
 */
export class RealtimeChannelHandler {
	private userId: string;
	private channelUsers: UserMap;
	private userStore = user;

	private channel: RealtimeChannel;

	// each tracked event will have a store 'cause reactivity
	// dunno if you're supposed to use them this way, though
	private events: { [key: string]: EventStore<any> };

	constructor(channelName: string, initUser: Participant, selfEvents: boolean) {
		this.userId = initUser.id;

		this.channelUsers = userMap();

		if (!selfEvents) {
			this.channelUsers.addUser(initUser.id, initUser);
		}

		this.events = {};

		this.channel = supabaseClient
			.channel(channelName, {
				config: {
					presence: {
						key: this.userId // make sender key eq user id
					},
					broadcast: {
						ack: true, // ask for ack
						self: selfEvents // send events to self
					}
				}
			})
			// handle joins => add to map
			// using the key as the id as that's how I remove // consistency
			.on('presence', { event: 'join' }, ({ key, newPresences }) => {
				this.channelUsers.addUser(key, newPresences[0]['user_data']);
			})
			// handle leaving => remove from map by key
			.on('presence', { event: 'leave' }, ({ key }) => {
				this.channelUsers.removeUserById(key);
			})
			.on('broadcast', { event: 'userSync' }, ({ payload }) => {
				this.channelUsers.updateUser(payload.userId, payload as Partial<UserUpdate>);
			})
			.subscribe(async (status) => {
				// this is seemingly the join event that is broadcasted -- without this, I don't seem to see joins
				if (status === 'SUBSCRIBED') {
					await this.channel.track({
						user_data: get(this.userStore),
						join_at: new Date().toISOString()
					});
				}
			});
	}

	/**
	 * saves events into an event store and registers a callback used to transform incoming events into designated eventstore type
	 *
	 * @param trackedEvent name of the event to track
	 * @param callback callback to transform the payload as desired
	 */
	public trackBroadcastEvent<T>(
		trackedEvent: string,
		callback: (payload: any) => T
	): RealtimeChannelHandler {
		// initialize
		this.events[trackedEvent] = eventStore();

		// subscribe
		this.channel.on('broadcast', { event: trackedEvent }, ({ payload }) => {
			this.events[trackedEvent].addEvent(callback(payload));
		});

		return this;
	}

	/**
	 * registers a callback to be called when a specified broadcast event is received
	 * similar to {@link trackBroadcastEvent} but does not save the event to an {@link EventStore}
	 *
	 * @param trackedEvent name of the event to track
	 * @param callback callback detailing how to handle the event payload
	 */
	public handleBroadcastEvent<T extends BroadcastEvent>(
		trackedEvent: string,
		callback: (payload: T) => void
	): RealtimeChannelHandler {
		this.channel.on('broadcast', { event: trackedEvent }, ({ payload }) => {
			callback(payload);
		});

		return this;
	}

	public addUserToChannel(user: Participant) {
		this.channelUsers.addUser(user.id, user);
	}

	/**
	 * Broadcasts an event to the channel with specified payload
	 * @param trackedEvent the event to broadcast
	 * @param payload the payload to broadcast
	 */
	public broadcastEvent<T extends BroadcastEvent>(
		trackedEvent: string,
		payload: T
	): Promise<RealtimeChannelSendResponse> {
		return this.channel.send({
			type: 'broadcast',
			event: trackedEvent,
			payload: payload
		});
	}

	/**
	 * this is a general update for non-performative uses - i.e., not votes
	 * that made me feel smart to write so I'm gonna leave it
	 * @param update user update to broadcast
	 */
	private broadcastUserUpdate(
		update: Partial<UserUpdate> & BroadcastEvent
	): Promise<RealtimeChannelSendResponse> {
		return this.broadcastEvent('userSync', update);
	}

	/**
	 * Leave the channel, if joined
	 */
	public async leaveChannel(): Promise<boolean> {
		if (this.channel && this.channel?.state === 'joined') {
			const res = await this.channel.unsubscribe();
			if (res !== 'ok') {
				return false;
			}
			// i guess this part kinda doesn't matter
			this.channelUsers.removeUserById(this.userId);
			return true;
		}
		throw new Error('Channel does not exist or is not joined');
	}

	/**
	 * Get the users currently in the channel
	 * @returns the user map for this channel
	 */
	public users(): UserMap {
		return this.channelUsers;
	}

	/**
	 * Retrieve the event store for a given tracked event
	 * @param event the event type to look up
	 * @returns the event store for the specified event
	 */
	public eventsFor<T>(event: string): EventStore<T> {
		if (this.events.hasOwnProperty(event)) {
			return this.events[event] as EventStore<T>;
		}

		throw new Error(`Event ${event} not tracked`);
	}

	/**
	 * Update the user details for the current user, triggers a broadcast for other users
	 * @param user user details to change
	 */
	public updateSelf(pUser: Partial<Participant>): Promise<RealtimeChannelSendResponse> {
		// not allowing user id changes
		if (pUser.id === this.userId) {
			// update self reference
			this.userStore.update((state) => {
				return { ...state, ...pUser };
			});

			// update map reference
			this.channelUsers.updateUser(this.userId, pUser);

			// broadcast update
			return this.broadcastUserUpdate({
				userId: this.userId,
				...pUser
			});
		}

		throw new Error('Cannot update user id; try a different modification');
	}
}
