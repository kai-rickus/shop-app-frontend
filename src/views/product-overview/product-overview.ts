interface ViewParams
{
	searchString: string;
}

export class ProductOverview
{
	searchString

	activate( params: ViewParams )
	{
		this.searchString = params.searchString;
	}
}
