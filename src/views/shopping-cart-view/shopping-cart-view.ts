import { RouteConfig } from "aurelia-router";

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
	// {
	// 	route    : [ 'bought' ],
	// 	name     : 'bought',
	// 	moduleId : './views/bought-view/bought-view',
	// 	nav      : true,
	// 	title    : 'Gekauft'
	// }
];

export class ShoppingCartView
{
	navigation;

	public configureRouter( config, router )
	{
		config.map( ROUTES );

		this.navigation = router.navigation
	}

}
