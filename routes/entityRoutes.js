
const entityValidation = require('../validations/entityValidations');
const entityController = require('../controllers/entityController');

// console.log(festivalValidation.searchV);
async function routes (fastify) {
    const entityRoutes = [
        {
            method: 'GET',
            url: '/search',
            schema: entityValidation.searchV,
            handler: entityController.searchC
        },
        {
            method: 'GET',
            url: '/getAll',
            schema: entityValidation.getAllV,
            handler: entityController.getAllC
        },
        {
            method: 'GET',
            url: '/getById/:id',
            schema: entityValidation.getByIdV,
            handler: entityController.getByIdC
        },
        {
            method: 'POST',
            url: '/post',
            schema: entityValidation.postV,
            handler: entityController.postC
        },
        {
            method: 'PUT',
            url: '/updateById/:id',
            schema: entityValidation.updateByIdV,
            handler: entityController.updateByIdVC
        },
        {
            method: 'DELETE',
            url: '/deleteById/:id',
            schema: entityValidation.deleteByIdC,
            handler: entityController.deleteByIdC
        },
    ];


    for(const route of entityRoutes){
        fastify.route(route);
    }
}

module.exports = routes;