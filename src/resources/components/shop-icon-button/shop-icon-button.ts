import { MDCRipple } from '@material/ripple';
import { bindable }  from "aurelia-framework";

export class ShopIconButton
{
	@bindable icon;
	@bindable outlined = false;
	@bindable round    = false;
	@bindable sharp    = false;
	@bindable twoTone  = false;

	iconButton;
	iconButtonElement;

	attached()
	{
		this.iconButton           = new MDCRipple( this.iconButtonElement );
		this.iconButton.unbounded = true;
	}
}
