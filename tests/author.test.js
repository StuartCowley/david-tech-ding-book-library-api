const { expect } = require("chai")
const request = require("supertest")
const { Author } = require("../src/models")
const app = require("../src/app")

describe("/authors", () => {
  before(async () => {
    await Author.sequelize.sync({ force: true })
  })

  describe("with no records in the database", () => {
    describe("POST /authors", () => {
      let testAuthor

      beforeEach(async () => {
        await Author.destroy({ where: {} })
        testAuthor = {
          author: "Jasper Lee",
        }
      })

      it("creates a new author in the database", async () => {
        const response = await request(app).post("/authors").send(testAuthor)
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        })

        expect(response.status).to.equal(201)
        expect(response.body.author).to.equal("Jasper Lee")
        expect(newAuthorRecord.author).to.equal("Jasper Lee")
      })

      it("returns an error when an author is not provided", async () => {
        testAuthor.author = null
        const response = await request(app).post("/authors").send(testAuthor)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Author is required")
      })

      it("returns an error when author is empty", async () => {
        testAuthor.author = " "
        const response = await request(app).post("/authors").send(testAuthor)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Author cannot be empty")
      })
    })
  })

  describe("with records in the database", () => {
    let authors

    beforeEach(async () => {
      await Author.destroy({ where: {} })
      authors = await Promise.all([
        Author.create({
          author: "Jasper Li",
        }),
        Author.create({
          author: "Jensen Ding",
        }),
        Author.create({
          author: "Alex Ding",
        }),
      ])
    })

    describe("POST /authors", () => {
      it("create a new author in the existing database", async () => {
        const response = await request(app).post("/authors").send({
          author: "Matt Lee",
        })

        expect(response.body.author).to.equal("Matt Lee")
        expect(response.status).to.equal(201)
      })

      it("returns an error when the author is not unique", async () => {
        const response = await request(app).post("/authors").send({
          author: "Jasper Li",
        })
        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Author needs to be unique")
      })
    })

    describe("GET /authors", () => {
      it("gets all authors records", async () => {
        const response = await request(app).get("/authors")

        expect(response.status).to.equal(200)
        expect(response.body.length).to.equal(3)

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id)

          expect(author.author).to.equal(expected.author)
        })
      })
    })

    describe("GET /authors/:id", () => {
      it("gets authors record by id", async () => {
        const author = authors[0]
        const response = await request(app).get(`/authors/${author.id}`)

        expect(response.status).to.equal(200)
        expect(response.body.author).to.equal(author.author)
      })

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app).get("/authors/12345")

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The author does not exist.")
      })
    })

    describe("PATCH /authors/:id", () => {
      it("updates authors name by id", async () => {
        const author = authors[0]
        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({ author: "Some other author name" })
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        })

        expect(response.status).to.equal(200)
        expect(updatedAuthorRecord.author).to.equal("Some other author name")
      })

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app)
          .patch("/authors/12345")
          .send({ author: "Some other author name" })

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The author does not exist.")
      })
    })

    describe("DELETE /authors/:id", () => {
      it("deletes author record by id", async () => {
        const author = authors[0]
        const response = await request(app).delete(`/authors/${author.id}`)
        const deletedAuthor = await Author.findByPk(author.id, { raw: true })

        expect(response.status).to.equal(204)
        expect(deletedAuthor).to.equal(null)
      })

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app).delete("/authors/12345")
        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The author does not exist.")
      })
    })
  })
})
