export class LocalDateValueConverter
{
	toView( value, language )
	{
		const date         = new Date( value )
		const formatedDate = date.toLocaleDateString( language, {
			day     : "2-digit",
			month   : "2-digit",
			year    : "numeric",
			weekday : "long",
		} )

		return formatedDate
	}
}
