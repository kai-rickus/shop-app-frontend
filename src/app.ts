import { RouteConfig, Router, RouterConfiguration } from 'aurelia-router';
import { autoinject, Container }                    from "aurelia-framework";
import { TaskQueue }                                from "aurelia-task-queue";
import environment                                  from "./environment";
import { ShopDb }                                   from "./services/shop-db";
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
		moduleId : './views/not-found-view/not-found-view'
	},
	{
		route    : [ 'bought' ],
		name     : 'bought',
		moduleId : './views/bought-view/bought-view',
		title    : 'bought'
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

	constructor(
		private _user: ShopUser,
		private _container: Container,
		private _db: ShopDb,
		private _taskQueue: TaskQueue,
	)
	{}

	async activate()
	{
		await this.handleAutoLogin()
	}

	async handleAutoLogin()
	{
		try
		{
			const record = await this._db
									 .dexie
									 .users
									 .where( 'refreshToken' )
									 .notEqual( "" )
									 .first()

			const savedRefreshToken = record?.refreshToken

			if( !savedRefreshToken ) return

			await this._user.loginWithToken( savedRefreshToken )

		}
		catch( error )
		{
			/* TODO: error handling */

			this._taskQueue.queueMicroTask( () =>
			{
				this._router.navigateToRoute( "login" )
			} )
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
