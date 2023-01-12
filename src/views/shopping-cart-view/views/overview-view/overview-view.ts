import { autoinject }       from "aurelia-framework";
import { Redirect }         from "aurelia-router";
import { TaskQueue }        from "aurelia-task-queue";
import { error }            from "jquery";
import environment          from "../../../../environment";
import { ShopUser }         from "../../../../services/shop-user";
import { ShoppingCartView } from "../../shopping-cart-view";

interface data
{
	address: []
	payment: []
	items: []
}

@autoinject()
export class OverviewView

{
	checkoutInformation;
	items;
	totalCost = 0;
	id;
	disabled  = false;
	pending = false;
	errorDialog;

	constructor(
		private _shoppingCartView: ShoppingCartView,
		private _taskqueue: TaskQueue,
		private _user: ShopUser
	)
	{}

	async attached()
	{
		this.checkoutInformation = await this.load( 65 )

		this.items = this.checkoutInformation.items

		this.totalCost = this.calcTotalCost()

		this._shoppingCartView.setHeightAfterRouting()
	}

	dummyMethod()
	{
		this._taskqueue.queueTask( async () =>
		{
			this._shoppingCartView.setHeightAfterRouting()
		} )
	}

	async load( id )
	{
		const response            = await fetch( `${environment.backendBaseUrl}cart/get/overview/${id}`, {
			headers : { "Authorization" : "Bearer " + this._user.accessToken }
		} );
		const checkoutInformation = await response.json()

		this._taskqueue.queueTask( async () =>
		{
			this._shoppingCartView.setHeightAfterRouting()
		} )

		return checkoutInformation
	}

	calcTotalCost()
	{
		let totalCost = 0;

		for( const item of this.items )
		{
			const sum = item.amount * item.product.price

			totalCost += sum
		}

		return totalCost;
	}

	async checkout()
	{
		this.disabled = true
		this.pending = true

		try
		{
debugger
			const response            = await fetch( `${environment.backendBaseUrl}cart/checkout`, {
				headers : { "Authorization" : "Bearer " + this._user.accessToken },
				method  : "POST",
			} );
			const checkoutInformation = await response.json()
			debugger
			this.disabled = false
			this.pending = false
			// this._taskqueue.queueTask( async () =>
			// {
			// 	this._shoppingCartView.setHeightAfterRouting()
			// } )
			const message = checkoutInformation.message
			throw new Error( `Server returned: ${message}` );
		}

		catch( error )
		{
			// this.errorDialog.open()
		}
	}
}
