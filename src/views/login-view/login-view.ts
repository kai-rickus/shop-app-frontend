import { Router, Redirect } from "aurelia-router";
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
	user;
	submitting            = false
	placeholder           = "test"
	loginHeadline         = "Login"
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

			this.user.accessToken  = data.accessToken;
			this.user.refreshToken = data.refreshToken;
			this.user.email        = decodedRefreshtoken.email

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

