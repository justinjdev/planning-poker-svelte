import { toastStore } from '@skeletonlabs/skeleton';

// copilot generated this, I assume it's not egregious but it's not great either
export function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function triggerToast(m: string) {
	toastStore.trigger({
		message: m
	});
}
