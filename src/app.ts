import { RouteConfig, Router, RouterConfiguration } from 'aurelia-router';
import { autoinject }                               from "aurelia-framework";
import { ShopUser }                                 from "./services/shop-user";
import { Dexie }                                    from "dexie/dist/dexie";

const ROUTES: RouteConfig[] = [
	{
		route              : [ 'product-overview' ],
		name               : 'product-overview',
		moduleId           : './views/product-overview/product-overview',
		nav                : true,
		title              : 'Product Overview',
		activationStrategy : 'replace'
	},
	{
		route    : [ 'login' ],
		name     : 'login',
		moduleId : './views/login-view/login-view',
		nav      : true,
		title    : 'Login'
	},
	{
		route    : [ 'not-found' ],
		name     : 'not-found',
		moduleId : 'views/not-found-view/not-found-view'
	},
	{
		route    : [ 'register' ],
		name     : 'register',
		moduleId : './views/register-view/register-view',
		nav      : true,
		title    : 'Register'
	},
	{
		route    : [ 'verify' ],
		name     : 'verify',
		moduleId : './views/verify-view/verify-view',
		nav      : true,
		title    : 'Verify'
	},
	{
		route    : [ 'email-sent' ],
		name     : 'email-sent',
		moduleId : './views/email-sent-view/email-sent-view',
		nav      : true,
		title    : 'email-sent'
	},
	{
		route              : [ 'product-detail' ],
		name               : 'product-detail',
		moduleId           : './views/product-detail-view/product-detail-view',
		nav                : true,
		title              : 'product-detail',
		activationStrategy : 'replace'
	},
	{
		route    : [ "", 'home' ],
		name     : 'home',
		moduleId : './views/home-view/home-view',
		nav      : true,
		title    : 'home'
	},
	{
		route    : [ 'shopping-cart' ],
		name     : 'shopping-cart',
		moduleId : './views/shopping-cart-view/shopping-cart-view',
		nav      : true,
		title    : 'shopping-cart'
	}

];

@autoinject()
export class App
{

	async activate()
	{
		const db = new Dexie( "ShopAppDatabase" );
		db.version( 1 )
		  .stores( {
			  users : "++id,refreshToken"
		  } );
	}

	public router: Router;

	constructor( private _user: ShopUser ){}

	public configureRouter( config: RouterConfiguration, router: Router ): Promise<void> | PromiseLike<void> | void
	{
		config.title = 'Shop';

		config.mapUnknownRoutes( {
			route : 'not-found', name : 'not-found', moduleId : 'views/not-found-view/not-found-view'
		} );

		config.map( ROUTES );

		this.router = router;
	}
}
