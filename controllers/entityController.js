const mEntity = require("../models/entityModel");
const response = require("../utils/response");

// Search entities by terms
async function searchC(req, res) {
    // Query
    let term = req.query.term;

    await mEntity
    .aggregate([
        {
            $search: {
                "index": 'Name',
                "autocomplete": {
                    "query": `${term}`,
                    "path": "name"
                }
            }
        }
    ])
    .then(function (festivalsFound) {
        if (festivalsFound.length > 0) {
            return res.status(200).send(
                response.responseOK("Get all entities succesfully", {
                    festivals: festivalsFound,
                })
            );
        } else {
            res.status(200).send(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
        }
    })
    .catch(function (err) {
        res.status(500).send(response.responseERROR(response.returnType.INVALID_FIELDS));
    });
}


// Gets all entities
async function getAllC(req, res) {
    // Query
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    let field;
    let direction;
    if(order) {
        field = order.split(":")[0];
        direction = order.split(":")[1];
    }

    mEntity
    .find()
    .sort(order ? {[field]: `${direction}`} : {name: 'asc'})
    .limit(!isNaN(limit) ? limit : null)
    .skip(!isNaN(offset) ? offset : null)
    .then(function (festivals) {
        if (festivals) {
            return res.status(200).send(
                response.responseOK("Get all entities succesfully", {
                    festivals: festivals,
                })
            );
        } else {
            res.status(200).send(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
        }
    })
    .catch(function (err) {
        res.status(500).send(response.responseERROR(response.returnType.INVALID_FIELDS));
    });
}


// Get entity by id
async function getByIdC(req, res) {
    // Params
    let idFestival = req.params.id.trim();

    // Debug
    if (!idFestival) {
        return res.status(400).send(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    mEntity
    .findOne({
        _id: idFestival
    }).then(function (festivalFound){
        return res.status(200).send(
            response.responseOK("Get entity succesfully", {
                festival: festivalFound,
            })
        );
    })
    .catch(function (err) {
        return res.status(404).send(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
    });
}


// Post entity by id
async function postC(req, res) {
    // Body
    let name = req.body.name.trim();
    let startDate = req.body.startDate.trim();
    let endDate = req.body.endDate.trim();
    let numberPlaces = parseInt(req.body.numberPlaces);

    if (!name || !startDate || !endDate || !numberPlaces) {
        return res.send(response.responseERROR(response.returnType.INVALID_FIELDS));
    }


    mEntity
    .findOne({
        name: name
    }).then(function (festivalFound){
        if(festivalFound) {
            return res.status(500).send(response.responseERROR("Festival already exist"));
        } else {
            new mEntity({
                name: name,
                startDate: startDate,
                endDate: endDate,
                numberPlaces: numberPlaces
            }).save()
            .then(function (newFestival) {
                // console.log(newFestival);
                if(newFestival) {
                    return res.status(201).send(response.responseOK(response.returnType.FESTIVAL.CREATED, { newFestival: newFestival}));
                } else {
                    return res.status(500).send(response.responseERROR(response.returnType.FESTIVAL.CANT_CREATE));
                }
            });
        }
    })
}


// Update entity by Id
async function updateByIdVC(req, res){
    // Params
    let idFestival = req.params.id;

    // Body
    let name = req.body.name.trim();
    let startDate = req.body.startDate.trim();
    let endDate = req.body.endDate.trim();
    let numberPlaces = parseInt(req.body.numberPlaces);

    if (!idFestival) {
        return res.status(400).send(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    mEntity
    .findOne({
        _id : idFestival
    }).then(function (festivalFound) {
        if(festivalFound) {
            festivalFound.updateOne( 
                {name: name},
                {startDate: startDate},
                {endDate: endDate},
                {numberPlaces: numberPlaces}
            ).then(function(festivalUpdated) {
                if(festivalUpdated) {
                    mEntity
                    .findOne({
                        _id : idFestival
                    }).then(function(festivalUpdated) {
                        return res.status(201).send(response.responseOK(response.returnType.FESTIVAL.UPDATED, { festivalUpdated: festivalUpdated}))
                    })
                }
            })
            .catch(function (err) {
                return res.status(500).send(response.responseERROR(response.returnType.FESTIVAL.CANT_UPDATE));
            }); 
        } else {
            return res.status(404).send(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
        }
    })
    .catch(function (err) {
        return res.status(500).send(response.responseERROR(response.returnType.FESTIVAL.CANT_UPDATE));
    });
} 


// Delete entity by Id
async function deleteByIdC(req, res) {
    // Params
    let idFestival = req.params.id.trim();

    // Debug
    if (!idFestival) {
        return res.status(400).send(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    mEntity
    .findOne({
        _id : idFestival
    }).then(function (festivalFound) {
        if(festivalFound) {
            festivalFound.delete();
            return res.status(201).send(response.responseOK(response.returnType.FESTIVAL.DESTROY)) 
        } else {
            return res.status(201).send(response.responseOK(response.returnType.FESTIVAL.NOT_FOUND)) 
        }
    })
    .catch(function (err) {
        // console.log(err);
        return res.status(500).send(response.responseERROR(response.returnType.FESTIVAL.CANT_DELETE));
    });
}


module.exports = {
    searchC,
    getAllC,
    getByIdC,
    postC,
    updateByIdVC,
    deleteByIdC,
}
