//Create fruits document

db.fruits.insertMany([{
                "name": "Apple",
                "color": "Red",
                "stock": 20,
                "price": 40,
                "supplier_id": 2,
                "onSale": true,
                "origin": ["Philippines", "Ecuador"]
        },
        {
                "name": "Banana",
                "color": "Yellow",
                "stock": 15,
                "price": 20,
                "supplier_id": 2,
                "onSale": true,
                "origin": ["Philippines", "Ecuador"]
        },
        {
                "name": "Kiwi",
                "color": "Green",
                "stock": 25,
                "price": 50,
                "supplier_id": 1,
                "onSale": true,
                "origin": ["US", "China"]
        },
        {
                "name": "Mango",
                "color": "Yellow",
                "stock": 10,
                "price": 120,
                "supplier_id": 2,
                "onSale": false,
                "origin": ["Philippines", "India"]
        }
]);

//MongoDB Aggregation
//used to generate manipulated data and perform operations to create filtered results that helps in analyzing data

//Using Aggregate method
/* $match
        -used to pass documents that meet the specified condition(s) to the next pipeline stage/aggregation process.
        - Syntax: { $match: {field:value} }
   $group
        - used to group elements together and field-value pairs using the data from the grouped elements
        - Syntax: { $group: {_id: "value", fieldResult: "valueResult"} }
*/

db.fruits.aggregate([
        { $match: { "onSale": true} },
        { $group: { "_id": "$supplier_id", total: {$sum: "$stock" } } }
]);

//Sorting aggregated results
/* $sort
        -can be used to change the order of aggregated result
        - Syntax: { $sort {field: 1/-1 } }
*/

db.fruits.aggregate([
        { $match: { "onSale": true} },
        { $group: { "_id": "$supplier_id", total: {$sum: "$stock" } } },
        { $sort: { "total": -1} }
]);

//Aggregating results based on array fields
/* $unwind
        - deconstructs an array field from a collection/field with an array value to output a result for each element
        - Syntax: { $unwind: field }
*/

db.fruits.aggregate([
        {$unwind: "$origin"}
]);

db.fruits.aggregate([
        {$unwind: "$origin"},
        { $group: {"_id": "$origin", "kinds": {$sum: 1}}}
]);


//Schema Design

//One-to-One Relationship

var owner = ObjectID();

db.owners.insert({
        _id: owner,
        name: "John Smith",
        contact: "09876457382"
});

db.suppliers.insert({
        name: "ABC Fruits",
        contact: "09978463728",
        owner_id: ObjectId("617771056c7598ae99473154")
})

//Update the owner document and insert the new field
db.owners.updateOne(
        { "_id": ObjectId("617771056c7598ae99473154") },
        {
                $set: {
                        "supplier_id": ObjectId("617771836c7598ae99473155")
                }
        }
        
);

/* Result:
{
    "_id" : ObjectId("617771056c7598ae99473154"),
    "name" : "John Smith",
    "contact" : "09876457382",
    "supplier_id" : ObjectId("617771836c7598ae99473155")
}
*/

//One-to-many relationship
db.suppliers.insertMany([
        {
        "name": "DEF Fruits",
        "contact": "09978836278",
        "owner_id": ObjectId("617771056c7598ae99473154")
        },
        {
        "name": "GHI Fruits",
        "contact": "09978834287",
        "owner_id": ObjectId("617771056c7598ae99473154")
        }
]);

db.owners.updateOne(
        { "_id": ObjectId("617771056c7598ae99473154") },
        {
                $set: {
                        "supplier_id": [ObjectId("617771836c7598ae99473155"), ObjectId("61777a026c7598ae99473156"), ObjectId("61777a026c7598ae99473157")]
                }
        }
        
);