import { autoinject, bindable } from "aurelia-framework";
import { Router }               from "aurelia-router";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";
import { BindingSignaler }      from 'aurelia-templating-resources';

@autoinject
export class NavigationBar
{
	private readonly _LOGIN_STATE_CHANGED_SIGNAL = ShopUser.LOGIN_STATE_CHANGED_SIGNAL

	private _itemsCount = 0;

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

	routeToLogin()
	{
		this._router.navigateToRoute( 'login' )
	}

	async setItemAmount()
	{
		if( !this._user.loggedIn )
		{
			this._itemsCount = 0

			/* TODO: aus indexedDb returnen */

			return 0
		}

		try
		{
			let itemAmount = 0;

			const response = await fetch( `${environment.backendBaseUrl}cart/get`, {
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );
			const data     = await response.json()

			for( const item of data.items )
			{
				itemAmount = itemAmount + item.amount
			}

			this._itemsCount = itemAmount
			return itemAmount
		}
		catch( error )
		{
			/* TODO: error handling */
		}
	}
}
