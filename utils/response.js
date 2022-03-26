
module.exports = {
    /**
     * @param {String} message - The message
     * @param {JSON} body - The Json (optional)
     * @returns {JSON}
     */
    responseOK: function (message, body) {
        if (body) {
        return {
            success: true,
            message: message,
            body: body,
        };
        } else {
        return {
            success: true,
            message: message,
        };
        }
    },

    /**
     * @param {String} error - The error message
     * @param {JSON} body - The Json (optional)
     * @returns {JSON}
     */
    responseERROR: function (error, body) {
        return {
        success: false,
        error: error,
        body: body,
        };
    },

    returnType: Object.freeze({
        INVALID_FIELDS: "Invalid field(s)",
        FESTIVAL: Object.freeze({
            CREATED: "Festival created successfully",
            UPDATED: "Festival updated succesfully",
            DESTROY: "Festival removed succesfully",
            NOT_FOUND: "Festival not found",
            UNABLE_TO_VERIFY: "Unable to verify festival",
            EXIST: "Festival already exist",
            NOEXIST:"Festival not exist",
            CANT_CREATE : "Cannot create festival",
            CANT_DELETE: "Cannot delete festival",
            CANT_UPDATE: "Cannot update festival"
        }),
    })
};



