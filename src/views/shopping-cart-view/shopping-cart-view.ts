import { RouteConfig, Router, RouterEvent } from "aurelia-router";
import { EventAggregator }                  from 'aurelia-event-aggregator';
import { autoinject }                       from "aurelia-framework";

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

@autoinject
export class ShoppingCartView
{
	navigation;
	routerElement: HTMLElement

	constructor( private _eventAggregator: EventAggregator ){}

	public configureRouter( config, router: Router )
	{
		config.map( ROUTES );

		this.navigation = router.navigation

		this._eventAggregator.subscribe( RouterEvent.Complete, event =>
		{
			this.setHeightAfterRouting()

			console.log( router );
			console.log( event );

			debugger
		} )
	}

	setHeightAfterRouting()
	{
		const [ view ] = Array.from( this.routerElement.children )

		this.routerElement.style.height = `${view.getBoundingClientRect().height}px`
	}
}
