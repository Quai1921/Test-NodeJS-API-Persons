const express = require("express")
const router = express.Router()
const Person = require("../models/person")
const { parse } = require('json2csv')
const path = require('path')
const fs = require('fs')



/**
 * @swagger
 * /api/persons:
 *   post:
 *     summary: Create a new person
 *     description: Creates a new person in the database.
 *     tags: [Persons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identification:
 *                 type: string
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: number
 *               photo:
 *                 type: string
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     number:
 *                       type: number
 *                     city:
 *                       type: string
 *     responses:
 *       201:
 *         description: Person created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       400:
 *         description: Bad request
 */
router.post("/persons", async (req, res) => {
    try {
        const person = new Person(req.body)
        await person.save()
        res.status(201).send(person)
    } catch (error) {
        res.status(400).send({ message: 'Bad request', error })
    }
})



/**
 * @swagger
 * /api/persons:
 *   get:
 *     summary: Get all persons
 *     description: Retrieves a list of all persons in the database.
 *     tags: [Persons]
 *     responses:
 *       200:
 *         description: List of persons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *       500:
 *         description: Server error
 */
router.get("/persons", async (req, res) => {
    try {
        const persons = await Person.find()
        res.status(200).send(persons)
    } catch (error) {
        res.status(500).send({ message: 'Server error', error })
    }
})

/**
 * @swagger
 * /api/persons/search:
 *   get:
 *     summary: Search persons by identification, name, or age
 *     description: Retrieves a list of persons filtered by query parameters.
 *     tags: [Persons]
 *     parameters:
 *       - in: query
 *         name: identification
 *         schema:
 *           type: string
 *         description: The identification of the person
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the person
 *       - in: query
 *         name: age
 *         schema:
 *           type: number
 *         description: The age of the person
 *     responses:
 *       200:
 *         description: List of persons matching query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *       500:
 *         description: Server error
 */
router.get("/persons/search", async (req, res) => {
    const { identification, name, age } = req.query
    try {
        const query = {}
        if (identification) query.identification = identification
        if (name) query.name = name
        if (age) query.age = age

        const persons = await Person.find(query)
        res.status(200).json(persons)
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * @swagger
 * /api/persons/{identification}:
 *   put:
 *     summary: Update a person by identification
 *     description: Updates a person with the given identification.
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: identification
 *         required: true
 *         schema:
 *           type: string
 *         description: The identification of the person to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: number
 *               photo:
 *                 type: string
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     number:
 *                       type: number
 *                     city:
 *                       type: string
 *     responses:
 *       200:
 *         description: Person updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       404:
 *         description: Person not found
 *       400:
 *         description: Bad request
 */
router.put("/persons/:identification", async (req, res) => {
    const { identification } = req.params
    const updateData = req.body

    if (updateData.identification) {
        delete updateData.identification
    }

    try {
        const person = await Person.findOneAndUpdate(
            { identification },
            updateData,
            { new: true, runValidators: true }
        )

        if (!person) {
            console.log("Person not found with identification:", identification)
            return res.status(404).send({ message: "Person not found" })
        }
        res.status(200).json(person)
    } catch (error) {
        res.status(400).send(error)
        res.status(400).send({ message: 'Bad request', error })
    }
})


/**
 * @swagger
 * /api/persons/{identification}:
 *   delete:
 *     summary: Delete a person by identification
 *     description: Deletes a person with the given identification.
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: identification
 *         required: true
 *         schema:
 *           type: string
 *         description: The identification of the person to delete
 *     responses:
 *       200:
 *         description: Person deleted successfully
 *       404:
 *         description: Person not found
 *       500:
 *         description: Server error
 */
router.delete("/persons/:identification", async (req, res) => {
    const { identification } = req.params
    try {
        const person = await Person.findOneAndDelete({ identification })
        if (!person) {
            return res.status(404).send({ message: "Person not found" })
        }
        res.status(200).send({ message: "Person deleted successfully" })
    } catch (error) {
        res.status(500).send({ message: 'Server error', error })
    }
})


/**
 * @swagger
 * /api/persons/{identification}:
 *   get:
 *     summary: Get a person by identification
 *     description: Retrieves a person with the given identification.
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: identification
 *         required: true
 *         schema:
 *           type: string
 *         description: The identification of the person to retrieve
 *     responses:
 *       200:
 *         description: Person found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       404:
 *         description: Person not found
 *       500:
 *         description: Server error
 */
router.get('/persons/:identification', async (req, res) => {
    const { identification } = req.params
    try {
        const person = await Person.findOne({ identification })
        if (!person) {
            return res.status(404).send({ message: 'Person not found' })
        }
        res.status(200).json(person)
    } catch (error) {
        res.status(500).send({ message: 'Server error', error })
    }
})


/**
 * @swagger
 * /api/persons/export:
 *   get:
 *     summary: Export persons to CSV
 *     description: Exports all persons to a CSV file.
 *     tags: [Persons]
 *     responses:
 *       200:
 *         description: CSV file exported successfully
 *       500:
 *         description: Error exporting data
 */
router.get('/export/persons', async (req, res) => {
    try {
        const persons = await Person.find()
        const csv = parse(persons.map(person => person.toObject()))
        const filePath = path.join(__dirname, 'persons.csv')

        fs.writeFileSync(filePath, csv)
        res.download(filePath, 'persons.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err)
                res.status(500).send({ message: 'Error exporting data' })
            }
        })
    } catch (error) {
        res.status(500).send({ message: 'Server error', error })
    }
})

module.exports = router
