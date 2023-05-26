const { expect } = require("chai")
const request = require("supertest")
const { Genre } = require("../src/models")
const app = require("../src/app")

describe("/genres", () => {
  before(async () => {
    await Genre.sequelize.sync({ force: true })
  })

  describe("with no records in the database", () => {
    describe("POST /genres", () => {
      let testGenre

      beforeEach(async () => {
        await Genre.destroy({ where: {} })
        testGenre = {
          genre: "Jasper Lee",
        }
      })

      it("creates a new genre in the database", async () => {
        const response = await request(app).post("/genres").send(testGenre)
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        })

        expect(response.status).to.equal(201)
        expect(response.body.genre).to.equal("Jasper Lee")
        expect(newGenreRecord.genre).to.equal("Jasper Lee")
      })

      it("returns an error when an genre is not provided", async () => {
        testGenre.genre = null
        const response = await request(app).post("/genres").send(testGenre)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Genre is required")
      })

      it("returns an error when genre is empty", async () => {
        testGenre.genre = " "
        const response = await request(app).post("/genres").send(testGenre)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Genre cannot be empty")
      })
    })
  })

  describe("with records in the database", () => {
    let genres

    beforeEach(async () => {
      await Genre.destroy({ where: {} })
      genres = await Promise.all([
        Genre.create({
          genre: "Jasper Li",
        }),
        Genre.create({
          genre: "Jensen Ding",
        }),
        Genre.create({
          genre: "Alex Ding",
        }),
      ])
    })

    describe("POST /genres", () => {
      it("create a new genre in the existing database", async () => {
        const response = await request(app).post("/genres").send({
          genre: "Matt Lee",
        })

        expect(response.body.genre).to.equal("Matt Lee")
        expect(response.status).to.equal(201)
      })

      it("returns an error when the genre is not unique", async () => {
        const response = await request(app).post("/genres").send({
          genre: "Jasper Li",
        })
        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal("Genre needs to be unique")
      })
    })

    describe("GET /genres", () => {
      it("gets all genres records", async () => {
        const response = await request(app).get("/genres")

        expect(response.status).to.equal(200)
        expect(response.body.length).to.equal(3)

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id)

          expect(genre.genre).to.equal(expected.genre)
        })
      })
    })

    describe("GET /genres/:id", () => {
      it("gets genres record by id", async () => {
        const genre = genres[0]
        const response = await request(app).get(`/genres/${genre.id}`)

        expect(response.status).to.equal(200)
        expect(response.body.genre).to.equal(genre.genre)
      })

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app).get("/genres/12345")

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The genre does not exist.")
      })
    })

    describe("PATCH /genres/:id", () => {
      it("updates genres name by id", async () => {
        const genre = genres[0]
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: "Some other genre name" })
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        })

        expect(response.status).to.equal(200)
        expect(updatedGenreRecord.genre).to.equal("Some other genre name")
      })

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app)
          .patch("/genres/12345")
          .send({ genre: "Some other genre name" })

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The genre does not exist.")
      })
    })

    describe("DELETE /genres/:id", () => {
      it("deletes genre record by id", async () => {
        const genre = genres[0]
        const response = await request(app).delete(`/genres/${genre.id}`)
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true })

        expect(response.status).to.equal(204)
        expect(deletedGenre).to.equal(null)
      })

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app).delete("/genres/12345")
        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal("The genre does not exist.")
      })
    })
  })
})
