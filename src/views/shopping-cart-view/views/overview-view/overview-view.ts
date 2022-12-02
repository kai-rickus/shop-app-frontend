import { autoinject }       from "aurelia-framework";
import { TaskQueue }        from "aurelia-task-queue";
import { ShopUser }         from "../../../../services/shop-user";
import { ShoppingCartView } from "../../shopping-cart-view";

@autoinject()
export class OverviewView
{
	products = [
		{
			name   : "Xbox Series S 512GB - Fortnite & Rocket League Bundle ",
			amount : 1,
			price  : "299.99"
		},
		{
			name   : "Nintendo Joy-Con 2er-Set, neon-lila/neon-orange",
			amount : 3,
			price  : "86.99"
		},
		{
			name   : "Playstation 5",
			amount : 4,
			price  : "499.99"
		},
		{
			name   : "Playstation 3",
			amount : 4,
			price  : "149.99"
		},
		{
			name   : "Playstation X",
			amount : 4,
			price  : "1099.99"
		}
	]

	fullName           = "Kai Rickus";
	street             = "Goethestr. 14";
	city               = "Köln";
	ZIP                = "50858";
	country            = "Deutschland";
	totalCost          = "222.78";
	paymentDisplayName = "PayPal";

	constructor(
		private _shoppingCartView: ShoppingCartView,
		private _taskqueue: TaskQueue,
		public user: ShopUser
	)
	{}

	attached()
	{
		this._shoppingCartView.setHeightAfterRouting()
	}

	dummyMethod()
	{
		this._taskqueue.queueTask( async () =>
		{
			this._shoppingCartView.setHeightAfterRouting()
		} )
	}

}
