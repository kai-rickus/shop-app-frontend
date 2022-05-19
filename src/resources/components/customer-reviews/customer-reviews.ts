import { bindable } from "aurelia-framework";
import environment  from "../../../environment";

export class CustomerReviews
{
	@bindable id;
	reviews           = [];
	offset            = 0
	allReviewsFetched = false

	async attached()
	{
		await this.loadReviewsPackage()
	}

	async loadReviewsPackage()
	{
		const url = `${environment.backendBaseUrl}product/reviews-package/${this.id}?offset=${this.offset}`

		try
		{
			const response = await fetch( url );
			const data     = await response.json()

			if( response.status === 404 )
			{
				this.allReviewsFetched = true

				return
			}

			for( const element of data.reviews )
			{
				this.reviews.push( element )
			}

			this.offset++
		}
		catch( error )
		{
			/* TODO: error handling */
		}
	}
}
