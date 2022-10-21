import { RouteConfig, Router, RouterConfiguration } from 'aurelia-router';
import { autoinject, Container }                    from "aurelia-framework";
import environment                                  from "./environment";
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
		title    : 'shopping-cart',
		settings : {
			auth : true
		}
	}
];

@autoinject()
export class App
{
	private static _NO_SCROLL_CLASS = "shop--no-scroll"

	private _router: Router;
	private _db;

	constructor( private _user: ShopUser, private _container: Container ){}

	async activate()
	{
		this.createDatabaseSchema()
		await this.handleAutoLogin()
	}

	createDatabaseSchema()
	{
		const db = new Dexie( "ShopAppDatabase" );

		db.version( 1 )
		  .stores( {
			  users : "++id, refreshToken"
		  } );

		this._container.registerInstance( Dexie, db )
		this._db = db
	}

	async handleAutoLogin()
	{
		const record            = await this._db.users.where( 'refreshToken' ).notEqual( "" ).first()
		const savedRefreshToken = record ? record.refreshToken : undefined

		if( savedRefreshToken !== undefined )
		{
			const response = await fetch( `${environment.backendBaseUrl}authentication/loginWithToken`, {
				method  : "post",
				headers : { "Authorization" : "Bearer " + savedRefreshToken }
			} )
			const userData = await response.json()

			userData.refreshToken = savedRefreshToken

			this._user.set( userData )

		}
	}

	public configureRouter( config: RouterConfiguration, router: Router ): Promise<void> | PromiseLike<void> | void
	{
		config.title = 'Shop';

		config.mapUnknownRoutes( {
			route : 'not-found', name : 'not-found', moduleId : 'views/not-found-view/not-found-view'
		} );

		config.map( ROUTES );

		this._router = router;
	}

	public toggleScroll( enable: boolean )
	{
		const { classList } = document.body

		if( enable ) return classList.remove( App._NO_SCROLL_CLASS )

		classList.add( App._NO_SCROLL_CLASS )
	}
}
