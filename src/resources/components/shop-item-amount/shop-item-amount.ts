import { autoinject, bindable } from "aurelia-framework";
import { TaskQueue }            from "aurelia-task-queue";
import { BindingSignaler }      from "aurelia-templating-resources";
import { debug }                from "util";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";
import { ShoppingCartView }     from "../../../views/shopping-cart-view/shopping-cart-view";
import { SIGNAL_CART_UPDATED }  from "../product-details-main/product-details-main";

@autoinject()
export class ShopItemAmount
{
	@bindable maxValue = 10;
	@bindable value;
	@bindable id;

	previousValue;
	textfield;
	disabled  = false;
	transform = false;

	constructor(
		private _user: ShopUser,
		private _signaler: BindingSignaler,
		private _shoppingCart: ShoppingCartView,
		private _taskqueue: TaskQueue,
	)
	{}

	attached()
	{
		if( this.value >= this.maxValue )
		{
			this.transform = true;
		}

		this.previousValue = this.value
	}

	async setCartItems( id, amount )
	{
		if( amount === "" )
		{
			this.value = this.previousValue

			return
		}

		if( this.value === this.maxValue )
		{
			this.transform = true;

			this._taskqueue.queueMicroTask( () =>
			{
				this.value = ""

				this.textfield.focus()
			} )

			return
		}

		this.disabled = true

		const response = await fetch( `${environment.backendBaseUrl}cart/set/${id}/${amount}`, {
			method  : "put",
			headers : { "Authorization" : "Bearer " + this._user.accessToken }
		} );

		if( !response.ok ) throw new Error( `Server returned status ${response.status}` )

		this.disabled = false

		this._signaler.signal( SIGNAL_CART_UPDATED )
	}
}
