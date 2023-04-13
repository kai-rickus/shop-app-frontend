import { MdcTextField }       from "@aurelia-mdc-web/text-field";
import { throws }             from "assert";
import { autoinject }         from "aurelia-framework";
import { Router }             from "aurelia-router";
import { BindingSignaler }    from "aurelia-templating-resources";
import { AddressField }       from "resources/components/address-field/address-field";
import { brotliCompress }     from "zlib";
import environment            from "../../../../../../environment"
import { ShopUser }           from "../../../../../../services/shop-user"
import { MdcSnackbarService } from '@aurelia-mdc-web/snackbar';
import { AddressView }        from "../../address-view";

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

	pending                        = false;
	disabled                       = false;
	submitting                     = false;
	snackbarSuccessMessage         = "Neue Adresse hinzugefügt!";
	snackbarSuccessMessageDuration = 10000;
	snackbarErrorMessage           = "Fehler! Bitte versuche es erneut.";
	snackbarErrorMessageDuration   = -1;

	static SIGNAL_ADDRESSES_UPDATED = "addresses-updated"

	constructor(
		private _user: ShopUser,
		private snackbar: MdcSnackbarService,
		private _router: Router,
		public signaler: BindingSignaler,
	)
	{}

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
		if( !this.isValid() ) return

		this.pending = true

		try
		{
			const response = await fetch( `${environment.backendBaseUrl}user/addresses/addAddress`,
				{
					method  : "put",
					headers : {
						"Authorization" : `Bearer ${this._user.accessToken}`,
						"Content-Type"  : "application/json"
					},
					body    : JSON.stringify( this.data ),
				}
			)

			if( !response.ok )
			{
				const data = await response.json()

				throw new Error( data.error )
			}

			this.signaler.signal( AddressView.SIGNAL_ADDRESSES_UPDATED );

			this.back()

			// Address-view zeichen geben, dass neu laden muss
		}
		catch( error )
		{
			await this.snackbar.open( this.snackbarErrorMessage, 'Okay', {
				timeout : this.snackbarErrorMessageDuration,
			} );
		}

		this.pending = false

		await this.snackbar.open( this.snackbarSuccessMessage, 'Okay', {
			timeout : this.snackbarSuccessMessageDuration,
		} );
	}

	back()
	{
		this._router.navigateBack()
	}
}
