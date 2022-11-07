import { autoinject }       from "aurelia-framework";
import { TaskQueue }        from "aurelia-task-queue";
import { ShoppingCartView } from "../../shopping-cart-view";

@autoinject()
export class OverviewView
{
	constructor( private _shoppingCartView: ShoppingCartView, private _taskqueue: TaskQueue )
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
