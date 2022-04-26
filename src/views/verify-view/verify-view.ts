import environment                from "../../environment";
import jwt_decode, { JwtPayload } from "jwt-decode";

export class VerifyView
{
	verificationSuccess = null;
	token

	activate( params: object )
	{
		this.tryVerification( params )
	}

	async tryVerification( params: object )
	{
		try
		{
			if( params[ "token" ] )
			{
				this.token = params[ "token" ];

				const response = await fetch( `${environment.backendBaseUrl}authentication/verify`, {
					method  : "PATCH",
					headers : { "Content-Type" : "application/json", "Authorization" : `Bearer ${this.token}` }
				} );

				this.verificationSuccess = response.ok
			}
		}
		catch( error )
		{
			this.verificationSuccess = false
		}
	}

	async resendEmail()
	{
		try
		{
			const { email }: { email: string } = jwt_decode( this.token )
			const url                          = `${environment.backendBaseUrl}authentication/retry-verification/${email}`;
			const response                     = await fetch( url, {
				method : "post",
			} );
		}
		catch( error )
		{
			console.log(error);
		}
	}
}
