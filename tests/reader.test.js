const { expect } = require("chai")
const request = require("supertest")
const { Reader } = require("../src/models")
const app = require("../src/app")

describe("/readers", () => {
  beforeEach(async () => {
    await Reader.destroy({ where: {} })
  })
})

describe("with no recrods in the databse", () => {
  describe("POST /readers", () => {
    it("creates a new reader in the database", async () => {
      const res = await request(app).post("/readers").send({
        name: "David Ding",
        email: "dingtechxing1@gmail.com",
      })
      expect(res.status).to.equal(201)

      const newReaderRecord = await Reader.findByPk(res.body.id, {
        raw: true,
      })

      expect(res.body.name).to.equal("David Ding")
      expect(newReaderRecord.name).to.equal("David Ding")
      expect(newReaderRecord.email).to.equal("dingtechxing1@gmail.com")
    })
  })
})
