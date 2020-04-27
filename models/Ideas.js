const ideas_Schema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["description", "userId"],
            properties: {
                description: {
                    bsonType: "string",
                    "description": "must be a string and is required"
                },
                userId: {
                    bsonType: "string",
                    "description": "must be a string and is required"
                }
            }
        }
    }
};
module.exports = ideas_Schema;