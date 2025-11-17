/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b2oym7fr4tkhpsr")

  collection.createRule = "@request.auth.id != \"\" && @request.auth.permissions_id.edit_employees = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b2oym7fr4tkhpsr")

  collection.createRule = ""

  return dao.saveCollection(collection)
})
