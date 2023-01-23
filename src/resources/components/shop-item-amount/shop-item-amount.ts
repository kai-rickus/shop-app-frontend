import { autoinject, bindable } from "aurelia-framework";
import { TaskQueue }            from "aurelia-task-queue";
import { BindingSignaler }      from "aurelia-templating-resources";
import { debug }                from "util";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";
import { ShoppingCartView }     from "../../../views/shopping-cart-view/shopping-cart-view";

@autoinject()
export class ShopItemAmount
{
	@bindable to;
	@bindable value;
	@bindable id;
	@bindable disabled  = false;
	@bindable from;
	@bindable transform = false;

	element: HTMLElement;
	previousValue;
	textfield;

	constructor(
		private _user: ShopUser,
		private _signaler: BindingSignaler,
		private _shoppingCart: ShoppingCartView,
		private _taskqueue: TaskQueue,
	)
	{}

	attached()
	{
		if( this.value >= this.to )
		{
			this.transform = true;
		}

		this.previousValue = this.value
	}

	onChange()
	{
		if( this.value !== this.to )
		{
			const event = new CustomEvent( "change-amount", {
				detail : { amount : this.value }
			} )

			return void this.element.dispatchEvent( event )
		}

		this.transform = true;

		this._taskqueue.queueMicroTask( () =>
		{
			this.value = ""

			this.textfield.focus()
		} )
	}
}
