import { autoinject }          from "aurelia-framework";
import { Router }              from "aurelia-router";
import { TaskQueue }           from "aurelia-task-queue";
import { BindingSignaler }     from "aurelia-templating-resources";
import { error }               from "jquery";
import environment             from "../../../../environment";
import { SIGNAL_CART_UPDATED } from "../../../../resources/components/product-details-main/product-details-main";
import { ShopUser }            from "../../../../services/shop-user";
import { ShoppingCartView }    from "../../shopping-cart-view";

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
	id = 95;
	disabled  = false;
	pending   = false;
	errorDialog;
	itemErrorDialog
	paymentErrorDialog;

	constructor(
		private _shoppingCartView: ShoppingCartView,
		private _taskqueue: TaskQueue,
		private _user: ShopUser,
		private _router: Router,
		private _signaler: BindingSignaler,
	)
	{}

	async attached()
	{
		console.log(this.id);

		this.checkoutInformation = await this.load( this.id )

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
		this.pending  = true

		try
		{
			const response            = await fetch( `${environment.backendBaseUrl}cart/checkout`, {
				headers : { "Authorization" : "Bearer " + this._user.accessToken },
				method  : "POST",
			} );
			const checkoutInformation = await response.json()

			if( !response.ok ) throw new Error( checkoutInformation.message );

			this._router.navigateToRoute( "bought" );
			this._signaler.signal( SIGNAL_CART_UPDATED )
		}
		catch( error )
		{
			this.errorDialog.open( error )
		}

		this.disabled = false
		this.pending  = false
	}
}
