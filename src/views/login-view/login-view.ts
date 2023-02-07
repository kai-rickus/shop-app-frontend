import { Router, Redirect } from "aurelia-router";
import { Dexie, Table }     from "dexie/dist/dexie";
import { debug }            from "util";
import environment          from "../../environment";
import { autoinject }       from "aurelia-framework";
import { BindingSignaler }  from 'aurelia-templating-resources';
import { ShopUser }         from "../../services/shop-user";
import jwt_decode           from "jwt-decode";

interface ShopDb extends Dexie
{
	users: Table;
}

export type JwtPayload = {
	email: string
};

const SIGNAL_LOGGING_IN = "logging-in";

@autoinject
export class LoginView
{
	unknownErrorOccured   = false
	forbiddenErrorOccured = false
	submitting            = false
	stayLoggedInSwitch: HTMLInputElement;
	formInput             = {
		email    : "",
		password : ""
	}

	constructor(
		public router: Router,
		private _user: ShopUser,
		private _signaler: BindingSignaler,
		private _db: Dexie
	)
	{}

	async submit()
	{
		this.submitting = true

		try
		{
			await this._user.login( this.formInput, this.stayLoggedInSwitch.checked )

			this._signaler.signal( SIGNAL_LOGGING_IN )
			this.router.navigateToRoute( "home" )
		}
		catch( error )
		{
			this.forbiddenErrorOccured = error.message === "Forbidden"
			this.unknownErrorOccured   = error.message !== "Forbidden"
		}

		this.submitting = false
	}

	canActivate()
	{
		if( this._user.refreshToken )
		{
			return new Redirect( '/home' )
		}
	}

}

