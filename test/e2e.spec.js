const request = require("supertest");
const app = require("../app");
const fs = require("fs");

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

    it('should . It should accept “multipart/form-data”', function () {
        return request(app)
            .post('/files')
            .attach('file', './test/test_files/test_file_1.txt')
            .set("Content-Type", "multipart/form-data")
            .expect(200);
    });

    it('should upload file to folder specified in environment variable', function (done ) {
        request(app)
            .post('/files')
            .attach('file', './test/test_files/test_file_1.txt')
            .set("Content-Type", "multipart/form-data")
            .then(function () {
                expect(fs.existsSync(`${process.env.FOLDER}/test_file_1.txt`)).toBeTruthy();
                done();
            })
            .catch(function (err) {
                done(err);
            })

    });
})
