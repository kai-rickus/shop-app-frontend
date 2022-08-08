import { MDCSelect } from '@material/select';
import { bindable }  from "aurelia-framework";

export class ShopSelectMenu
{
	@bindable disabled = false;
	selectMenuElement;
	select;
	labelName = "Anzahl"

	attached()
	{
		this.select = new MDCSelect( this.selectMenuElement );
	}

	get value()
	{
		return this.select.value;
	}

	set value( value )
	{
		this.select.value = value
	}

}
