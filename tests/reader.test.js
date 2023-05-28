const { expect } = require("chai")
const request = require("supertest")
const { Reader } = require("../src/models")
const app = require("../src/app")

describe("/readers", () => {
  before(async () => {
    await Reader.sequelize.sync({ force: true })
  })

  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      let testReader

      beforeEach(async () => {
        await Reader.destroy({ where: {} })
        testReader = {
          name: "David Ding",
          email: "dingtechxing1@gmail.com",
          password: "pass1234",
        }
      })

      it("creates a new reader in the database", async () => {
        const response = await request(app).post("/readers").send(testReader)
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        })

        expect(response.status).to.equal(201)
        expect(response.body.name).to.equal("David Ding")
        expect(response.body.password).to.equal(undefined)

        expect(newReaderRecord.name).to.equal("David Ding")
        expect(newReaderRecord.email).to.equal("dingtechxing1@gmail.com")
        expect(newReaderRecord.password).to.equal("pass1234")
      })

      it("returns an error when a name is not provided", async () => {
        testReader.name = null
        const response = await request(app).post("/readers").send(testReader)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Name is required")
      })

      it("returns an error when a name is empty", async () => {
        testReader.name = " "
        const response = await request(app).post("/readers").send(testReader)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Name cannot be empty")
      })

      it("returns an error when an email is not provided", async () => {
        testReader.email = null
        const response = await request(app).post("/readers").send(testReader)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Email is required")
      })

      it("returns an error when an email is empty", async () => {
        testReader.email = " "
        const response = await request(app).post("/readers").send(testReader)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Email cannot be empty")
      })

      it("returns an error when a password is not provided", async () => {
        testReader.password = null
        const response = await request(app).post("/readers").send(testReader)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Password is required")
      })

      it("returns an error when a password is empty", async () => {
        testReader.password = " "
        const response = await request(app).post("/readers").send(testReader)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Password cannot be empty")
      })

      it("returns an error if a password length is less than 8 characters", async () => {
        testReader.password = "pass123"
        const response = await request(app).post("/readers").send(testReader)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal(
          "Password has to be at least 8 characters"
        )
      })
    })
  })

  describe("with records in the database", () => {
    let readers

    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create({
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
          password: "pass1234",
        }),
        Reader.create({
          name: "Arya Stark",
          email: "vmorgul@me.com",
          password: "pass12345",
        }),
        Reader.create({
          name: "Lyra Belacqua",
          email: "darknorth123@msn.org",
          password: "pass123456",
        }),
      ])
    })

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const response = await request(app).get("/readers")

        expect(response.status).to.equal(200)
        expect(response.body.length).to.equal(3)

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id)

          expect(reader.name).to.equal(expected.name)
          expect(reader.email).to.equal(expected.email)
          expect(reader.password).to.equal(undefined)
        })
      })
    })

    describe("GET /readers/:id", () => {
      it("gets readers record by id", async () => {
        const reader = readers[0]
        const response = await request(app).get(`/readers/${reader.id}`)

        expect(response.status).to.equal(200)
        expect(response.body.name).to.equal(reader.name)
        expect(response.body.email).to.equal(reader.email)
        expect(response.body.password).to.equal(undefined)
      })

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).get("/readers/12345")

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The reader does not exist.")
      })
    })

    describe("PATCH /readers/:id", () => {
      it("updates readers email by id", async () => {
        const reader = readers[0]
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "miss_e_bennet@gmail.com" })
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        })

        expect(response.status).to.equal(200)
        expect(updatedReaderRecord.email).to.equal("miss_e_bennet@gmail.com")
      })

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app)
          .patch("/readers/12345")
          .send({ email: "some_new_email@gmail.com" })

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The reader does not exist.")
      })
    })

    describe("DELETE /readers/:id", () => {
      it("deletes reader record by id", async () => {
        const reader = readers[0]
        const response = await request(app).delete(`/readers/${reader.id}`)
        const deletedReader = await Reader.findByPk(reader.id, { raw: true })

        expect(response.status).to.equal(204)
        expect(deletedReader).to.equal(null)
      })

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).delete("/readers/12345")
        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The reader does not exist.")
      })
    })
  })
})
