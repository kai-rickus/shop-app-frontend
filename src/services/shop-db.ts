import { Dexie, Table } from "dexie/dist/dexie";

interface ShopDexie extends Dexie
{
	users: Table
}

export class ShopDb
{
	private _dexie: ShopDexie

	get dexie()
	{
		return this._dexie
	}

	constructor()
	{
		const db = new Dexie( "ShopAppDatabase" ) as ShopDexie;

		db.version( 1 )
		  .stores( {
			  users : "++id, refreshToken"
		  } );

		this._dexie = db
	}
}
