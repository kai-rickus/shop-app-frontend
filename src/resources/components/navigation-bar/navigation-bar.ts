import { autoinject, bindable } from "aurelia-framework";
import { Router }               from "aurelia-router";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";
import { BindingSignaler }      from 'aurelia-templating-resources';


@autoinject
export class NavigationBar
{
	items     = [];
	showBadge = false;

	constructor(
		private _router: Router,
		private _user: ShopUser,
	)
	{}

	search( event )
	{
		this._router.navigateToRoute(
			"product-overview",
			{ searchString : event.detail.string }
		)
	}

	async setItemAmount()
	{

		if( !this._user.refreshToken ) return

		try
		{
			let itemAmount = 0;

			const response = await fetch( `${environment.backendBaseUrl}cart/get`, {
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );
			const data     = await response.json()
			data.items

			for( const item of data.items )
			{
				itemAmount = itemAmount + item.amount
			}

			if( itemAmount > 0 )
			{
				this.showBadge = true
			}
			else
			{
				this.showBadge = false
			}

			return itemAmount
		}
		catch( error )
		{
			console.error( error );
		}
	}
}
