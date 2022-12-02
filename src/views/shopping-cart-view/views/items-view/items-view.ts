import { autoinject }          from "aurelia-framework";
import { TaskQueue }           from "aurelia-task-queue";
import { BindingSignaler }     from "aurelia-templating-resources";
import environment             from "../../../../environment";
import { SIGNAL_CART_UPDATED } from "../../../../resources/components/product-details-main/product-details-main";
import { ShopUser }            from "../../../../services/shop-user";
import { ShoppingCartView }    from "../../shopping-cart-view";

@autoinject()
export class ItemsView
{
	value;
	disabled                     = false;
	private _SIGNAL_CART_UPDATED = SIGNAL_CART_UPDATED;

	textfield;
	to;
	transform = false;
	previousValue;

	constructor(
		private _user: ShopUser,
		private _signaler: BindingSignaler,
		private _shoppingCart: ShoppingCartView,
		private _taskqueue: TaskQueue
	)
	{
	}

	attached()
	{
		this._shoppingCart.setHeightAfterRouting()
	}

	async getCardItems()
	{
		const response = await fetch( `${environment.backendBaseUrl}cart/get`, {
			headers : { "Authorization" : "Bearer " + this._user.accessToken }
		} );
		const data     = await response.json()

		this._taskqueue.queueTask( async () =>
		{
			this._shoppingCart.setHeightAfterRouting()

		} )
		return data.items
	}

	async setCartItems( id, amount )
	{

		if( amount === "" )
		{
			this.value = this.previousValue

			return
		}

		if( amount === this.to )
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

		this._taskqueue.queueTask( async () =>
		{
			this._shoppingCart.setHeightAfterRouting()
		} )

		this.disabled = false
		this._signaler.signal( SIGNAL_CART_UPDATED )
	}
}
