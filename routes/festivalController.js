const express = require("express");
const router = express.Router();
const models = require("../models");
const response = require("../utils/response");

const { Op } = require('sequelize');

// Create festival
router.post("/post", (req, res) => {

    // Body
    let name = req.body.name.trim();
    let startDate = req.body.startDate.trim();
    let endDate = req.body.endDate.trim();
    let numberPlaces = req.body.numberPlaces.trim();

    if (!name || !startDate || !endDate || !numberPlaces) {
        return res.json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    models.festival
    .findOne({
        where: { name: name },
    }).then(function (festivalFound){
        if(festivalFound) {
            return res.status(500).json( response.responseERROR("Festival already exist"));
        } else {
            models.festival
            .create({
                name: name,
                startDate: startDate,
                endDate: endDate,
                numberPlaces: numberPlaces
            })
            .then(function (newFestival) {
                if(newFestival) {
                    return res.status(201).json( response.responseOK(response.returnType.FESTIVAL.CREATED, { newFestival: newFestival}));
                } else {
                    return res.json(response.responseERROR(response.returnType.FESTIVAL.CANT_CREATE));
                }
            });
        }
    })
});

// Gets all festivals
router.get("/getAll", (req, res) => {
    // Query
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    models.festival
        .findAll({
        order: [order != null ? order.split(":") : ["name", "ASC"]],
        limit: !isNaN(limit) ? limit : null,
        offset: !isNaN(offset) ? offset : null,
        })
        .then(function (festivals) {
            if (festivals) {
                return res.status(200).json(
                    response.responseOK("", {
                        festivals: festivals,
                    })
                );
            } else {
                res.status(200).json(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
            }
        })
        .catch(function (err) {
        res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    });
});


// Get festival by Id
router.get("/getById/:id", (req, res) => {
    // Params
    let idFestival = req.params.id.trim();;

    // Debug
    if (!idFestival) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    models.festival
    .findOne({
        where: { id: idFestival },
    }).then(function (festivalFound){
        if(festivalFound) {
            return res.status(200).json(
                response.responseOK("", {
                    festival: festivalFound,
                })
            );
        } else {
            return res.status(400).json(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
        }
    });
});


// Update festival by id
router.put("/updateById/:id", (req, res) => {
    // Params
    let idFestival = req.params.id;

    // Body
    let name = req.body.name.trim();
    let startDate = req.body.startDate.trim();
    let endDate = req.body.endDate.trim();
    let numberPlaces = parseInt(req.body.numberPlaces.trim());

    if (!idFestival) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    models.festival
    .findOne({
        where: { id: idFestival }         
    }).then(function (festivalFound){

        //Debug - Find festival with same name

        // models.festival
        // .findOne({
        //      where: { 
        //         name: { [Op.eq]: name},
        //         id: { [Op.ne]: festivalFound.id }
        //     }
        // }).then(function (festivalExist) {
        //     if(festivalExist) {
        //         return res.json(response.responseERROR(response.returnType.FESTIVAL.EXIST));
        //     }
        // });

        if(festivalFound) {
            festivalFound
            .update({
              name: name ? name : festivalFound.name,
              startDate: startDate ? startDate : festivalFound.startDate,
              endDate: endDate ? endDate : festivalFound.endDate,
              numberPlaces: numberPlaces ? numberPlaces : festivalFound.numberPlaces,
            })
            .then(function (festivalUpdated) {
                if(festivalUpdated) {
                    return res.status(201).json(response.responseOK(response.returnType.FESTIVAL.UPDATED, { festivalUpdated: festivalUpdated}))
                }
            })
            .catch(function (err) {
                return res.status(500).json(response.responseERROR(response.returnType.FESTIVAL.CANT_UPDATE));
            });
        }
    });
});


// Delete festival by id
router.delete("/deleteById/:id", (req, res) => {
    // Params
    let idFestival = req.params.id.trim();;

    // Debug
    if (!idFestival) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    models.festival
    .findOne({
        where: { id: idFestival },
    }).then(function (festivalFound){
        if(festivalFound) {
            festivalFound
            .destroy({
              where: {
                id: idFestival,
              },
            }).then(function (festivalDestroyed) {
                return res.status(201).json(response.responseOK(response.returnType.FESTIVAL.DESTROY, { festivalDestroyed: festivalDestroyed}))
            })
            .catch(function (err) {
                return res.status(500).json(response.responseERROR(response.returnType.FESTIVAL.CANT_DELETE));
            });
        } else {
            return res.status(400).json(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
        }
    });
});

module.exports = router;
