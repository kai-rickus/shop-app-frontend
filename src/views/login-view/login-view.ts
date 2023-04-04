import { Router, Redirect }   from "aurelia-router";
import { Dexie, Table }       from "dexie/dist/dexie";
import { debug }              from "util";
import environment            from "../../environment";
import jwt_decode             from "jwt-decode";
import { autoinject }         from "aurelia-framework";
import { BindingSignaler }    from 'aurelia-templating-resources';
import { ShopUser }           from "../../services/shop-user";
import { MDCSwitch }          from '@material/switch';
import { MdcSnackbarService } from "@aurelia-mdc-web/snackbar";

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
	stayLoggedInSwitch: MDCSwitch;
	unknownErrorOccured   = false
	forbiddenErrorOccured = false
	submitting            = false
	WrongEmailOrPassword  = false
	formInput             = {
		email    : "",
		password : ""
	}

	constructor(
		public router: Router,
		private _user: ShopUser,
		private _signaler: BindingSignaler,
		private _db: Dexie,
		private _snackbar: MdcSnackbarService,
	)
	{}

	async submit()
	{
		this.submitting = true

		try
		{
			await this._user.login( this.formInput, this.stayLoggedInSwitch.selected )

			this._signaler.signal( SIGNAL_LOGGING_IN )
			this.router.navigateToRoute( "home" )
		}
		catch( error )
		{
			if( error.message === "Forbidden" )
			{
				this._snackbar.open( "Email oder Passwort inkorrekt", 'Okay', {} );
			}
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

