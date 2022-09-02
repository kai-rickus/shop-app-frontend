import { BindingSignaler } from "aurelia-templating-resources";
import environment         from "../../../../environment";
import { ShopUser }        from "../../../../services/shop-user";
import { autoinject }      from "aurelia-framework";
import { observable }      from "aurelia-typed-observable-plugin";

export interface UserAddress
{
	id: number;
	firstname: string;
	lastname: string;
	country: string;
	city: string;
	zip: string;
	street: string;
	selected: boolean;
}

const SIGNAL_ADDRESSES_UPDATED = "addresses-updated"

@autoinject
export class AddressView
{
	@observable selectedAddress = null

	addresses = []
	loading   = false

	constructor( public user: ShopUser, public signaler: BindingSignaler ){}

	created()
	{
		this.load()
	}

	async load()
	{
		this.loading = true

		try
		{
			const response = await fetch( `${environment.backendBaseUrl}user/addresses`, {
				headers : { "Authorization" : "Bearer " + this.user.accessToken }
			} );

			if( !response.ok ) throw new Error( `Server returned status ${response.status}` )

			const json = await response.json()

			this.addresses       = json.addresses as UserAddress[]
			this.selectedAddress = this.addresses.find( item => item.selected )

			console.log( "reloading..." );

			this.signaler.signal( SIGNAL_ADDRESSES_UPDATED )
		}
		catch( error )
		{
			console.error( error );

			/* TODO: handling */
		}

		this.loading = false
	}

	async radioChanged()
	{
		await this.setSelectedAddress()
		await this.load()
	}

	async setSelectedAddress()
	{
		/* TODO: fetch() */
	}
}
