import { MdcTextField } from "@aurelia-mdc-web/text-field";
import { throws }       from "assert";
import { autoinject }   from "aurelia-framework";
import { AddressField } from "resources/components/address-field/address-field";
import environment      from "../../../../../../environment"
import { ShopUser }     from "../../../../../../services/shop-user"

interface Inputs
{
	firstname: MdcTextField;
	lastname: MdcTextField;
	address: AddressField;
}

@autoinject()
export class AddAddressView
{
	inputs: Inputs = {
		firstname : null,
		lastname  : null,
		address   : null,
	};

	data = {
		firstname : "",
		lastname  : "",
		placeId   : "",
	}

	constructor( private _user: ShopUser ){}

	validate()
	{
		// @ts-ignore
		if( !this.inputs.firstname.valid ) this.inputs.firstname.foundation.styleValidity()
		// @ts-ignore
		if( !this.inputs.lastname.valid ) this.inputs.lastname.foundation.styleValidity()

		if( !this.inputs.address.valid ) this.inputs.address.validate()
	}

	isValid()
	{
		this.validate();

		const valid = this.checkValidityOfAllInputs();

		return valid;
	}

	checkValidityOfAllInputs(): boolean
	{
		if( !this.inputs.firstname.valid ) return false;
		if( !this.inputs.lastname.valid ) return false;
		if( !this.inputs.address.valid ) return false;

		return true;
	}

	async createNewAddress()
	{
		try
		{

			if( !this.isValid() ) return

			const response = await fetch( `${environment.backendBaseUrl}user/addresses/addAddress`,
				{
					method  : "put",
					headers : { "Authorization" : this._user.accessToken },
					body    : JSON.stringify( this.data )
				}
			)
			console.log( "alles bueno" );

			if( !response.ok )
			{
				const data = await response.json()
				throw new Error( data.error )
			}
		}
		catch( error )
		{
			console.log( "Fehler:", error );
			/* TODO: errorhandling */
		}
	}
}

/* TODO: snackbar */

