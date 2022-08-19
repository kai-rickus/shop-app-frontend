import { MDCRipple }           from '@material/ripple';
import { MDCIconButtonToggle } from '@material/icon-button';
import { bindable }            from "aurelia-framework";

export class ShopIconButton
{
	@bindable icon;
	@bindable iconOn;
	@bindable active   = false;
	@bindable outlined = false;
	@bindable round    = false;
	@bindable sharp    = false;
	@bindable twoTone  = false;
	@bindable disabled = false;

	iconButton;
	iconButtonElement;
	element;

	attached()
	{
		if( this.iconOn )
		{
			this.iconButton = new MDCIconButtonToggle( this.iconButtonElement );
			this.setListener()
		}
		else
		{
			this.iconButton           = new MDCRipple( this.iconButtonElement );
			this.iconButton.unbounded = true;
		}

	}

	setListener()
	{
		this.iconButton.listen( "MDCIconButtonToggle:change", ( event ) =>
		{
			const customEvent = new CustomEvent( "change", { detail : event.detail } )

			this.active = event.detail.isOn

			this.element.dispatchEvent( customEvent )
		} )
	}
}
