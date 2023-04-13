import { MdcSnackbarService }    from "@aurelia-mdc-web/snackbar";
import { autoinject, singleton } from "aurelia-framework";
import { Router }                from "aurelia-router";
import { BindingSignaler }       from "aurelia-templating-resources";
import { Dexie, Table }          from "dexie/dist/dexie";
import environment               from "../environment";
import { ShopDb }                from "./shop-db";

export interface UserOptions
{
	accessToken?: string;
	refreshToken?: string;
	lastName?: string;
	firstName?: string;
	email?: string;
	avatar: string;
}

interface LoginData
{
	email: string;
	password: string;
}

@singleton()
@autoinject()
export class ShopUser
{
	static readonly LOGIN_STATE_CHANGED_SIGNAL = "login-state-changed"

	snackbarSuccessMessage = "Erfolgreich abgemeldet";

	private _loggedIn = false;
	get loggedIn(): boolean
	{
		return this._loggedIn;
	}

	private _accessToken
	get accessToken()
	{
		return this._accessToken
	}

	private _refreshToken
	get refreshToken()
	{
		return this._refreshToken
	}

	private _firstName
	get firstName()
	{
		return this._firstName
	}

	private _lastName
	get lastName()
	{
		return this._lastName
	}

	private _email
	get email()
	{
		return this._email
	}

	private _avatar
	get avatar()
	{
		return this._avatar
	}

	constructor(
		private _router: Router,
		private _db: ShopDb,
		private _signaler: BindingSignaler,
		private _snackbar: MdcSnackbarService,
	)
	{}

	private _set( options: UserOptions )
	{
		this._accessToken  = options.accessToken
		this._refreshToken = options.refreshToken
		this._avatar       = options.avatar
		this._lastName     = options.lastName
		this._firstName    = options.firstName
		this._email        = options.email
	}

	private _clear()
	{
		this._accessToken  = null
		this._refreshToken = null
		this._firstName    = null
		this._lastName     = null
		this._email        = null
		this._avatar       = null
	}

	async login( data: LoginData, remember: boolean = false )
	{
		const response = await fetch( `${environment.backendBaseUrl}authentication/login`, {
			method  : "post",
			body    : JSON.stringify( data ),
			headers : { "Content-Type" : "application/json" }
		} );

		if( !response.ok )
		{
			if( response.status === 403 ) throw new Error( "Forbidden" );

			throw new Error();
		}

		const json = await response.json()

		this._set( json )

		if( remember )
		{
			this._db.dexie.users.add( {
				refreshToken : json.refreshToken
			} );
		}

		this._loggedIn = true;

		this._signaler.signal( ShopUser.LOGIN_STATE_CHANGED_SIGNAL )
	}

	async logout()
	{
		const response = await fetch( `${environment.backendBaseUrl}authentication/logout`, {
			method  : "Delete",
			headers : { "Authorization" : "Bearer " + this.refreshToken }
		} );

		if( !response.ok ) throw new Error( `Server returned status ${response.status}` );

		await this._db.dexie.users.clear()

		this._clear()

		this._snackbar.open( this.snackbarSuccessMessage, 'Okay' )

		this._loggedIn = false;

		this._signaler.signal( ShopUser.LOGIN_STATE_CHANGED_SIGNAL )
	}

	async loginWithToken( savedRefreshToken: string )
	{
		const response = await fetch( `${environment.backendBaseUrl}authentication/loginWithToken`, {
			method  : "post",
			headers : { "Authorization" : "Bearer " + savedRefreshToken }
		} )

		if( !response.ok )
		{
			if( response.status === 403 ) throw new Error( "Forbidden" );

			throw new Error();
		}

		const json = await response.json()

		json.refreshToken = savedRefreshToken

		this._set( json )

		this._loggedIn = true;

		this._signaler.signal( ShopUser.LOGIN_STATE_CHANGED_SIGNAL )
	}
}
