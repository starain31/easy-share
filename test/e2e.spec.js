const request = require("supertest");
const app = require("../app");

describe("Test the root path", () => {
    test("It should response the root path", done => {
        request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe('POST /files', () => {
    it('should be defined', function () {
        return request(app)
            .post('/files')
            .expect(200);
    });
})
