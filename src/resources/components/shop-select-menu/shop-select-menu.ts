import { MDCSelect } from '@material/select';
import { bindable }  from "aurelia-framework";

const a = 1

export class ShopSelectMenu
{
	@bindable disabled = false;
	@bindable value;
	@bindable lable    = ""
	selectMenuElement;
	select;

	attached()
	{
		this.select = new MDCSelect( this.selectMenuElement );
		this.value  = this.select.value

		this.select.listen( 'MDCSelect:change', () => this.onChange() );

	}

	onChange()
	{
		this.value  = this.select.value
		const event = new CustomEvent( "change", {
			detail : {
				value : this.value
			}
		} )

		this.selectMenuElement.dispatchEvent( event )
	}

	valueChanged( newValue )
	{
		this.select.value = newValue
	}

	// get value()
	// 	{
	// 		return this.select.value;
	// 	}
	//
	// 	set value( value )
	// 	{
	// 		this.select.value = value
	// 	}

}
