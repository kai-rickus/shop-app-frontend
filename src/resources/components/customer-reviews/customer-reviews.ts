import { bindable } from "aurelia-framework";
import environment  from "../../../environment";

export class CustomerReviews
{
	@bindable id;

	private _noReviews = false;
	private _firstTimeLoading = false
	loading            = false;
	reviews            = [];
	offset             = 0
	allReviewsFetched  = false

	async attached()
	{
		this._firstTimeLoading = true
		await this.loadReviewsPackage()
		this._firstTimeLoading = false

	}

	async loadReviewsPackage()
	{
		const url = `${environment.backendBaseUrl}product/reviews-package/${this.id}?offset=${this.offset}`

		try
		{
			this.loading = true

			const response = await fetch( url );
			const data     = await response.json()

			if( response.status === 404 )
			{
				this.allReviewsFetched = true
				this.loading           = false

				return
			}

			this._noReviews = data.reviews.length === 0

			for( const element of data.reviews )
			{
				this.reviews.push( element )
			}

			this.offset++
		}
		catch( error )
		{
			/* TODO: error handling-: Wie handlen? */
		}

		this.loading = false

	}
}
