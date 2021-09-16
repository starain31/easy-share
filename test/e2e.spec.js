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
            .attach('file', './test/test_files/test_file_1.txt')
            .set("Content-Type", "multipart/form-data")
            .expect(200);
    });

    it('should . It should accept “multipart/form-data”', function () {
        return request(app)
            .post('/files')
            .attach('file', './test/test_files/test_file_1.txt')
            .set("Content-Type", "multipart/form-data")
            .expect(200);
    });

    it('should return a “publicKey” and a “privateKey”', function (done ) {
        request(app)
            .post('/files')
            .attach('file', './test/test_files/test_file_1.txt')
            .set("Content-Type", "multipart/form-data")
            .then(function (response) {
                expect(response.body.publicKey).toBeDefined();
                expect(response.body.privateKey).toBeDefined();
                done();
            });
    });

    it('should upload the file',function (done) {
        const upload_file_path = './test/test_files/GrMyfpm.jpg';
        request(app)
            .post('/files')
            .attach('file', upload_file_path)
            .set("Content-Type", "multipart/form-data")
            .then(function (response) {
                request(app)
                    .get(`/files/${response.body.publicKey}`)
                    .expect(200)
                    .then(async function (response ) {
                        expect(Buffer.compare(fs.readFileSync(upload_file_path), response.body)).toBe(0);
                        done();
                    })
            });
    });
})
