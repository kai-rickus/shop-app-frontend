import { Redirect, Router } from "aurelia-router";
import jwt_decode           from "jwt-decode";
import environment          from "../../environment";
import { ShopUser }         from "../../services/shop-user";
import { JwtPayload }       from "../login-view/login-view";
import { autoinject }       from "aurelia-framework";

@autoinject
export class RegisterView
{
	router;

	constructor( router: Router )
	{
		this.router = router;
	}

	// canActivate()
	// {
	//   if( this.user.refreshToken )
	//   {
	//     return new Redirect( '/product-overview' )
	//   }
	// }

	formInput = {
		firstname    : "",
		lastname     : "",
		email        : "",
		password     : "",
		language     : navigator.language,
		country      : "",
		state        : "",
		city         : "",
		zip          : "",
		street       : "",
		streetNumber : "",
		newsletter   : false
	}

	password
	passwordConfirm

	submitting = false

	attached()
	{
		( window as any ).formInput = this.formInput
	}

	passwordChanged()
	{
		if( this.password.value !== this.passwordConfirm.value )
		{
			this.passwordConfirm.setCustomValidity( 'Passwörter müssen übereinstimmen' );

			return;
		}

		this.passwordConfirm.setCustomValidity( '' );
	}

	async submit()
	{

		this.submitting = true

		try
		{
			const url      = `${environment.backendBaseUrl}authentication/register`
			const options  = {
				method  : "put",
				body    : JSON.stringify( this.formInput ),
				headers : { "Content-Type" : "application/json" },
			}
			const response = await fetch( url, options );

			this.router.navigateToRoute( "email-sent" )
		}
		catch( error )
		{
			// this.forbiddenErrorOccured = error.message === "Forbidden"
			// this.unknownErrorOccured   = error.message !== "Forbidden"
		}

		this.submitting = false

	}

}

