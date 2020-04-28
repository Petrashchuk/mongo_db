const user_Schema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["age", "gender", "nationality", "firstName"],
            properties: {
                firstName: {
                    bsonType: "string",
                    "description": "must be a string and is required"
                },
                age: {
                    bsonType: "int",
                    "description": "must be a int and is required"
                },
                gender: {
                    bsonType: "string",
                    "description": "must be a string and is required"
                },
                nationality: {
                    bsonType: "string",
                    "description": "must be a string and is required"
                },
                ideas: {
                    bsonType: "array",
                    "description": "must be a string and is required"
                }
            }
        }
    }
};
module.exports = user_Schema;
