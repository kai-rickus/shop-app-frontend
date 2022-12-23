import { autoinject }       from "aurelia-framework";
import { TaskQueue }        from "aurelia-task-queue";
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
			let sum = item.amount * item.product.price

			totalCost += sum
		}

		return totalCost;
	}

}
