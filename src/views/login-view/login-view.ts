import { Router, Redirect } from "aurelia-router";
import { debug }            from "util";
import environment          from "../../environment";
import { autoinject }       from "aurelia-framework";
import { ShopUser }         from "../../services/shop-user";
import jwt_decode           from "jwt-decode";

export type JwtPayload = {
	email: string
};

@autoinject
export class LoginView
{
	unknownErrorOccured   = false
	forbiddenErrorOccured = false
	router;
	user: ShopUser;
	submitting            = false
	formInput             = {
		email    : "",
		password : ""
	}

	constructor( router: Router, user: ShopUser )
	{
		this.router = router;
		this.user   = user;
	}

	async submit()
	{
		this.submitting = true
		try
		{
			const response = await fetch( `${environment.backendBaseUrl}authentication/login`, {
				method  : "post",
				body    : JSON.stringify( this.formInput ),
				headers : { "Content-Type" : "application/json" }
			} );

			if( !response.ok )
			{
				if( response.status === 403 ) throw new Error( "Forbidden" );

				throw new Error();
			}

			const data                = await response.json()
			const decodedRefreshtoken = jwt_decode( data.refreshToken ) as JwtPayload

			this.router.navigateToRoute( "product-overview" )

			this.user.email        = decodedRefreshtoken.email
			this.user.accessToken  = data.accessToken;
			this.user.refreshToken = data.refreshToken;
			this.user.firstName    = data.firstName;
			this.user.lastName     = data.lastName;
			this.user.avatar       = data.avatar;

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
		if( this.user.refreshToken )
		{
			return new Redirect( '/product-overview' )
		}
	}
}

