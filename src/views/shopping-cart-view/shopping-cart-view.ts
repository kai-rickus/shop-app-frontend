import { RouteConfig, Router, RouterEvent } from "aurelia-router";
import { autoinject }                       from "aurelia-framework";
import { BindingSignaler }                  from "aurelia-templating-resources";
import environment                          from "../../environment";
import { SIGNAL_CART_UPDATED }              from "../../resources/components/product-details-main/product-details-main";
import { ShopUser }                         from "../../services/shop-user";
import { ItemsView }                        from "./views/items-view/items-view";

const ROUTES: RouteConfig[] = [
	{
		route    : [ "", 'items' ],
		name     : 'items',
		moduleId : './views/items-view/items-view',
		nav      : true,
		title    : 'Waren'
	},
	{
		route    : [ 'address' ],
		name     : 'address',
		moduleId : './views/address-view/address-view',
		nav      : true,
		title    : 'Lieferadresse'
	},
	{
		route    : [ 'payment' ],
		name     : 'payment',
		moduleId : './views/payment-view/payment-view',
		nav      : true,
		title    : 'Zahlungart'
	},
	{
		route    : [ 'overview' ],
		name     : 'overview',
		moduleId : './views/overview-view/overview-view',
		nav      : true,
		title    : 'Endübersicht'
	},
];

export const SIGNAL_CART_INFORMATION_UPDATED = "cart-information-updated"

@autoinject
export class ShoppingCartView
{
	private static _PACKAGING_PRICE_MOCKUP = 0

	navigation;
	routerElement: HTMLElement
	pending       = false;
	disableBuying = false;

	private _SIGNAL_CART_UPDATED             = SIGNAL_CART_UPDATED
	private _SIGNAL_CART_INFORMATION_UPDATED = SIGNAL_CART_INFORMATION_UPDATED
	private _data                            = {
		itemsTotal : 0,
		packaging  : 0,
		total      : 0,
	}

	public configureRouter( config, router: Router )
	{
		config.map( ROUTES );

		this.navigation = router.navigation

	}

	constructor(
		private _user: ShopUser,
		private _router: Router,
		private _signaler: BindingSignaler
	)
	{}

	attached()
	{
		if( !this._user.loggedIn )
		{

			this.disableBuying = true
		}
	}

	setHeightAfterRouting()
	{
		const [ view ] = Array.from( this.routerElement.children )

		this.routerElement.style.height = `${view.getBoundingClientRect().height}px`
	}

	async calculateData()
	{
		try
		{
			const response = await fetch( `${environment.backendBaseUrl}cart/get`, {
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );
			const data     = await response.json()

			if( !response.ok ) throw new Error( data.message )

			let itemsTotal = 0;

			for( const item of data.items )
			{
				itemsTotal += item.amount * item.product.price
			}

			this._data.itemsTotal = itemsTotal
			this._data.packaging  = ShoppingCartView._PACKAGING_PRICE_MOCKUP
			this._data.total      = itemsTotal + ShoppingCartView._PACKAGING_PRICE_MOCKUP
		}
		catch( error )
		{
			/* TODO: error handling-: Wie handlen? */
		}
	}

	async determineBuyingPermission()
	{
		this.pending = true

		try
		{
			const response = await fetch( `${environment.backendBaseUrl}cart/getOverview`, {
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );

			const checkoutInformation = await response.json()

			if( !response.ok ) throw new Error( checkoutInformation.message );

			this.disableBuying = checkoutInformation.items.length === 0
				|| !checkoutInformation.address
				|| !checkoutInformation.payment

		}
		catch( error )
		{
			/* TODO: error handling-: Wie handlen? */
		}

		this.pending = false
	}

	async buy()
	{
		this.pending = true

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
			this._signaler.signal( SIGNAL_CART_INFORMATION_UPDATED )
		}
		catch( error )
		{
			/* TODO: error handling */
		}

		this.pending = false
	}
}
