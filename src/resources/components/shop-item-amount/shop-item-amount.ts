import { autoinject, bindable } from "aurelia-framework";
import { TaskQueue }            from "aurelia-task-queue";
import { BindingSignaler }      from "aurelia-templating-resources";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";
import { ShoppingCartView }     from "../../../views/shopping-cart-view/shopping-cart-view";
import { SIGNAL_CART_UPDATED }  from "../product-details-main/product-details-main";

@autoinject()
export class ShopItemAmount
{

	@bindable productId;
	@bindable productAmount;

	user: ShopUser
	value;
	disabled = false;

	constructor(
		user: ShopUser,
		private _signaler: BindingSignaler,
		private _shoppingCart: ShoppingCartView,
		private _taskqueue: TaskQueue
	)
	{
		this.user = user;
	}

	attached()
	{
		console.log( this.productAmount );
	}

	// async getCardItems()
	// {
	// 	const response = await fetch( `${environment.backendBaseUrl}cart/get`, {
	// 		headers : { "Authorization" : "Bearer " + this.user.accessToken }
	// 	} );
	// 	const data     = await response.json()
	//
	// 	this._taskqueue.queueTask( async () =>
	// 	{
	// 		this._shoppingCart.setHeightAfterRouting()
	//
	// 	} )
	// 	return data.items
	// }

	async setCartItems( id, amount )
	{
		this.disabled = true

		console.log( this.productAmount );

		const response = await fetch( `${environment.backendBaseUrl}cart/set/${id}/${amount}`, {
			method  : "put",
			headers : { "Authorization" : "Bearer " + this.user.accessToken }
		} );

		if( !response.ok ) throw new Error( `Server returned status ${response.status}` )

		// this._taskqueue.queueTask( async () =>
		// {
		// 	this._shoppingCart.setHeightAfterRouting()
		//
		// } )

		this.disabled = false
		this._signaler.signal( SIGNAL_CART_UPDATED )

	}
}
