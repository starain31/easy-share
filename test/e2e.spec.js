const request = require("supertest");
const create_app = require("../app");
const create_db = require("../db");
const fs = require("fs");


let app;
let db;
jest.setTimeout(1000);

beforeAll( (done) => {
    create_db()
        .then((_db) => {
            db = _db;
            app = create_app({db});
            done();
        });
});

afterAll(function (done) {
    db.disconnect()
        .then(function () {
            done();
        })
});

describe('API', () => {
    it('should be defined', function () {
        return request(app)
            .post('/files')
            .attach('file', './test/uploads/test_file_1.txt')
            .set("Content-Type", "multipart/form-data")
            .expect(200);
    });

    it('It should accept “multipart/form-data”', function () {
        return request(app)
            .post('/files')
            .attach('file', './test/uploads/test_file_1.txt')
            .set("Content-Type", "multipart/form-data")
            .expect(200);
    });

    it('should return a “publicKey” and a “privateKey”', function (done) {
        request(app)
            .post('/files')
            .attach('file', './test/uploads/test_file_1.txt')
            .set("Content-Type", "multipart/form-data")
            .then(function (response) {
                expect(response.body.publicKey).toBeDefined();
                expect(response.body.privateKey).toBeDefined();
                done();
            });
    });

    it('should upload the file', async function () {
        const upload_file_path = './test/uploads/code-test.pdf';
        const {publicKey} = await request(app)
            .post('/files')
            .attach('file', upload_file_path)
            .set("Content-Type", "multipart/form-data")
            .then(function (response) {
                return response.body;
            });
        const uploaded_file = await request(app)
            .get(`/files/${publicKey}`)
            .expect(200)
            .then(function (response) {
                return response.body;
            });

        expect(Buffer.compare(fs.readFileSync(upload_file_path), uploaded_file)).toBe(0);
    });

    it('should delete file', async function () {
        const upload_file_path = './test/uploads/code-test.pdf';
        const {privateKey, publicKey} = await request(app)
            .post('/files')
            .attach('file', upload_file_path)
            .set("Content-Type", "multipart/form-data")
            .then(function (response) {
                return response.body;
            });

        await request(app)
            .delete(`/files/${privateKey}`)
            .expect(200)
            .expect({message: 'file has been deleted.'});

        await request(app)
            .get(`/files/${publicKey}`)
            .expect(404);

    });
});
