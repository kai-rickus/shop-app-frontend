import { RouteConfig, Router } from "aurelia-router";
import { TaskQueue }           from "aurelia-task-queue";
import { BindingSignaler }     from "aurelia-templating-resources";
import environment             from "../../../../environment";
import { ShopUser }            from "../../../../services/shop-user";
import { autoinject }          from "aurelia-framework";
import { ShoppingCartView }    from "../../shopping-cart-view";

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

@autoinject
export class AddressView
{
	selectedAddress = null;
	addresses       = []
	loading         = false
	errorDialog
	router: Router

	static ROUTES: RouteConfig[]            = [
		{
			route    : [ "" ],
			name     : 'default',
			moduleId : './views/default-view/default-view',
			title    : ''
		},
		{
			route    : [ 'add' ],
			name     : 'add',
			moduleId : './views/add-address-view/add-address-view',
			title    : 'Adresse hinzufügen'
		}
	]
	static SIGNAL_ADDRESSES_UPDATED         = "addresses-updated"
	static SIGNAL_ADDRESSES_LOCALLY_CHANGED = "addresses-locally-changed"

	constructor( public user: ShopUser, public signaler: BindingSignaler, private _shoppingCartView: ShoppingCartView, private _taskqueue: TaskQueue ){}

	public configureRouter( config, router )
	{
		config.map( AddressView.ROUTES );

		this.router = router
	}

	attached()
	{
		this._shoppingCartView.setHeightAfterRouting()
	}

	async load()
	{
		this.addresses = []

		this.signaler.signal( AddressView.SIGNAL_ADDRESSES_LOCALLY_CHANGED )

		this.loading   = true;

		try
		{
			const response = await fetch( `${environment.backendBaseUrl}user/addresses`, {
				headers : { "Authorization" : "Bearer " + this.user.accessToken }
			} );

			if( !response.ok ) throw new Error( `Server returned status ${response.status}` );

			const json = await response.json();

			this.addresses       = json.addresses;
			this.selectedAddress = this.addresses.find( item => item.selected );

			this.signaler.signal( AddressView.SIGNAL_ADDRESSES_LOCALLY_CHANGED )
		}
		catch( error )
		{
			this.errorDialog.open()
		}
		this.loading = false;

		this._taskqueue.queueTask( async () =>
		{
			this._shoppingCartView.setHeightAfterRouting()
		} )

		this._shoppingCartView.setHeightAfterRouting()

	}
	async radioChanged( id: string )
	{
		this.loading = true;

		await this.setSelectedAddress( id );

		this.loading = false;
	}

	async setSelectedAddress( id: string )
	{
		try
		{
			const response = await fetch( `${environment.backendBaseUrl}user/addresses/setSelected/${id}`, {
				method  : "post",
				headers : { "Authorization" : "Bearer " + this.user.accessToken }
			} );

			if( !response.ok )
			{
				const json    = await response.json();
				const message = json?.error || response.status;

				throw new Error( `Server returned: ${message}` );
			}
		}
		catch( error )
		{
			this.errorDialog.open()
		}
	}
}
