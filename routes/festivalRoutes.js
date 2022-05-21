
const festivalValidation = require('../validations/festivalValidation');
const festivalController = require('../controllers/festivalController');

// console.log(festivalValidation.searchV);
async function routes (fastify) {
    const festivalRoutes = [
        {
            method: 'GET',
            url: '/search',
            schema: festivalValidation.searchV,
            handler: festivalController.searchC
        },
        {
            method: 'GET',
            url: '/getAll',
            schema: festivalValidation.getAllV,
            handler: festivalController.getAllC
        },
        {
            method: 'GET',
            url: '/getById/:id',
            schema: festivalValidation.getByIdV,
            handler: festivalController.getByIdC
        },
        {
            method: 'POST',
            url: '/post',
            schema: festivalValidation.postV,
            handler: festivalController.postC
        },
        {
            method: 'PUT',
            url: '/updateById/:id',
            schema: festivalValidation.updateByIdV,
            handler: festivalController.updateByIdVC
        },
        {
            method: 'DELETE',
            url: '/deleteById/:id',
            schema: festivalValidation.deleteByIdC,
            handler: festivalController.deleteByIdC
        },
    ];


    for(const route of festivalRoutes){
        fastify.route(route);
    }
}

module.exports = routes;