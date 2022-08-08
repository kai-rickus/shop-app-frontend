import { MDCRipple }           from '@material/ripple';
import { MDCIconButtonToggle } from '@material/icon-button';
import { bindable }            from "aurelia-framework";

export class ShopIconButton
{
	@bindable icon;
	@bindable iconOn;
	@bindable outlined = false;
	@bindable round    = false;
	@bindable sharp    = false;
	@bindable twoTone  = false;

	iconButton;
	iconButtonElement;

	attached()
	{
		if( this.iconOn )
		{
			this.iconButton = new MDCIconButtonToggle( this.iconButtonElement );
		}
		else
		{
			this.iconButton           = new MDCRipple( this.iconButtonElement );
			this.iconButton.unbounded = true;
		}

	}
}
