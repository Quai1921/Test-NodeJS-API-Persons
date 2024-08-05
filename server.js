const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const personRoutes = require('./routes/personRoutes')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const errorHandler = require('./middlewares/errorHandler')

const app = express()
const port = process.env.PORT || 3000


mongoose.connect('mongodb://localhost:27017/APINEXOPERSON')

app.use(bodyParser.json())
app.use(cors())


app.use('/api', personRoutes)



app.use(errorHandler)


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Test Nexo - Persons API',
        version: '1.0.0',
        description: 'API to manage persons and addresses',
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Development server',
        },
    ],
    components: {
        schemas: {
            Person: {
                type: 'object',
                properties: {
                    identification: { type: 'string' },
                    name: { type: 'string' },
                    lastName: { type: 'string' },
                    age: { type: 'integer' },
                    photo: { type: 'string' },
                    addresses: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                street: { type: 'string' },
                                number: { type: 'integer' },
                                city: { type: 'string' }
                            }
                        }
                    }
                },
                required: ['identification', 'name', 'lastName', 'age', 'photo']
            }
        }
    }
}


const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = app