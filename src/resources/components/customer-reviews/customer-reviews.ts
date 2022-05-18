import { bindable } from "aurelia-framework";
import environment  from "../../../environment";

export class CustomerReviews
{
	reviews;
	@bindable id;
	@bindable artur

	async attached()
	{
		this.reviews = await this.getReviewsPackage()
	}

	async getReviewsPackage()
	{
		const response = await fetch( `${environment.backendBaseUrl}product/reviews-package/${this.id}` );
		const data     = await response.json()

		return data.reviews;
	}

}
