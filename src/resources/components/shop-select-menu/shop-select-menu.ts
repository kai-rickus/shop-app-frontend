import { MDCSelect } from '@material/select';

export class ShopSelectMenu
{
	selectMenuElement;
	select;
	value;

	// get value()
	// {
	// 	return this.select.value;
	// }
	//
	// set value( value )
	// {
	// 	this.select.value = value
	// }

	attached()
	{

		this.select = new MDCSelect( this.selectMenuElement );

		this.select.listen( 'MDCSelect:change', () =>
		{
			this.value = this.select.value;
		} );
	}

}
