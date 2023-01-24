import { autoinject }                      from "aurelia-framework";
import { TaskQueue }                       from "aurelia-task-queue";
import { BindingSignaler }                 from "aurelia-templating-resources";
import environment                         from "../../../../environment";
import { SIGNAL_CART_UPDATED }             from "../../../../resources/components/product-details-main/product-details-main";
import { ShopUser }                        from "../../../../services/shop-user";
import { ShoppingCartView }                from "../../shopping-cart-view";
import { SIGNAL_CART_INFORMATION_UPDATED } from "../../shopping-cart-view";

@autoinject()
export class ItemsView
{
	noItems   = false;
	disabled  = false;
	transform = false;
	textfield;
	value;
	to;
	amount;

	private _SIGNAL_CART_UPDATED = SIGNAL_CART_UPDATED;

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
		try
		{
			const response = await fetch( `${environment.backendBaseUrl}cart/get`, {
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );
			const data     = await response.json()

			this._taskqueue.queueTask( async () =>
			{
				this._shoppingCart.setHeightAfterRouting()
			} )

			if( data.items.length === 0 ) this.noItems = true

			return data.items
		}
		catch( error )
		{
			/* TODO: error handling */
		}
	}

	async setCartItems( id, amount )
	{
		this.disabled = true

		try
		{
			const response = await fetch( `${environment.backendBaseUrl}cart/set/${id}/${amount}`, {
				method  : "put",
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );

			if( !response.ok ) throw new Error( `Server returned status ${response.status}` )

			this._taskqueue.queueTask( async () => void this._shoppingCart.setHeightAfterRouting() )

			console.log( response );
		}
		catch( error )
		{
			/* TODO: error handling */
			;
		}

		this.disabled = false

		this._signaler.signal( SIGNAL_CART_INFORMATION_UPDATED )
		this._signaler.signal( this._SIGNAL_CART_UPDATED )
	}
}
