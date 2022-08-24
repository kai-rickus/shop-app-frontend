import { bindable } from 'aurelia-typed-observable-plugin';

export class ShopProgressTracker
{
	@bindable align: string;
	@bindable textPosition: string;
	@bindable withText: boolean;
}
