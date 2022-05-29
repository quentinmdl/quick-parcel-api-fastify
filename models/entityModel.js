const mongoose = require('mongoose');
const entitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    },
    {
        timestamps: { 
            createdAt: 'created_at', 
            updatedAt: 'updated_at'
        } 
    }
);

const Entity = mongoose.model('entity', entitySchema);
module.exports = Entity;