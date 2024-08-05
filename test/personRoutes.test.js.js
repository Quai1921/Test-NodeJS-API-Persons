const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const expect = chai.expect

chai.use(chaiHttp)

describe('Person API', () => {
  let testPersonId

  const testPerson = {
    identification: '12345678',
    name: 'Juan',
    lastName: 'Pereze',
    age: 30,
    photo: 'http://example.com/photo.jpg',
    addresses: [
      {
        street: 'San Martin',
        number: 123,
        city: 'Cordoba'
      }
    ]
  }

  describe('POST /api/persons', () => {
    it('should create a new person', (done) => {
      chai.request(app)
        .post('/api/persons')
        .send(testPerson)
        .end((err, res) => {
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('identification', testPerson.identification)
          testPersonId = res.body.identification
          done()
        })
    })
  })

  describe('GET /api/persons', () => {
    it('should get all persons', (done) => {
      chai.request(app)
        .get('/api/persons')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          done()
        })
    })
  })

  describe('GET /api/persons/search', () => {
    it('should search persons by query parameters', (done) => {
      chai.request(app)
        .get('/api/persons/search')
        .query({ name: testPerson.name })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body[0]).to.have.property('name', testPerson.name)
          done()
        })
    })
  })

  describe('PUT /api/persons/:identification', () => {
    it('should update a person', (done) => {
      const updatedData = { age: 31 }
      chai.request(app)
        .put(`/api/persons/${testPersonId}`)
        .send(updatedData)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('age', updatedData.age)
          done()
        })
    })
  })

  describe('GET /api/persons/:identification', () => {
    it('should get a person by identification', (done) => {
      chai.request(app)
        .get(`/api/persons/${testPersonId}`)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('identification', testPersonId)
          done()
        })
    })
  })

  describe('DELETE /api/persons/:identification', () => {
    it('should delete a person', (done) => {
      chai.request(app)
        .delete(`/api/persons/${testPersonId}`)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('message', 'Person deleted successfully')
          done()
        })
    })
  })


  describe('GET /api/export/persons', () => {
    it('should export persons to CSV', (done) => {
        chai.request(app)
            .get('/api/export/persons')
            .end((err, res) => {
                if (err) return done(err)
                expect(res).to.have.status(200)
                expect(res.header['content-type'].toLowerCase()).to.include('text/csv')
                expect(res.header['content-type'].toLowerCase()).to.include('charset=utf-8')
                expect(res.header['content-disposition']).to.include('attachment filename="persons.csv"')
                done()
        })
    })
  })
})