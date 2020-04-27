const feedback_Schema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["ideaId", "userId", "value"],
            properties: {
                ideaId: {
                    bsonType: "string",
                    description: "must be a string if the field exists"
                },
                userId: {
                    bsonType: "string",
                    "description": "must be a string and is required"
                },
                value: {
                    bsonType: 'string',
                    description: "must be a string if the field exists"
                }
            }
        }
    }
};
module.exports = feedback_Schema;
