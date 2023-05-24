const { expect } = require("chai")
const request = require("supertest")
const { Book } = require("../src/models")
const app = require("../src/app")

describe("/books", () => {
  before(async () => {
    await Book.sequelize.sync({ force: true })
  })

  beforeEach(async () => {
    await Book.destroy({ where: {} })
  })

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send({
          title: "My Life",
          author: "David Ding",
          genre: "Biography",
          ISBN: "100-888-888",
        })
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        })

        expect(response.status).to.equal(201)
        expect(response.body.title).to.equal("My Life")
        expect(newBookRecord.title).to.equal("My Life")
        expect(newBookRecord.author).to.equal("David Ding")
        expect(newBookRecord.genre).to.equal("Biography")
        expect(newBookRecord.ISBN).to.equal("100-888-888")
      })
    })
  })
})
