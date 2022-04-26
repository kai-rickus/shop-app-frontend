export class CurrencyValueConverter
{
	toView( value, currency, language = "de-DE" )
	{
		return new Intl.NumberFormat( language, { style : 'currency', currency : currency } ).format( value );
	}
}
