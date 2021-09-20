const request = require("supertest");
const create_app = require("../app");
const create_db = require("../db");
const fs = require("fs");


let app;
let db;
const daily_usages = {
    time_window: Number(process.env.TIME_WINDOW),
    UPLOAD_LIMIT: Number(process.env.UPLOAD_LIMIT),
    DOWNLOAD_LIMIT: Number(process.env.DOWNLOAD_LIMIT)
}

beforeAll( async () => {
    db = await create_db();
    app = await create_app({
        db,
        ...daily_usages,
        provider_name: process.env.PROVIDER,
        upload_folder: process.env.FOLDER
    });
});

afterAll(async () => {
    db.disconnect();
});

afterEach(async () => {
   await db.clear_all();
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

    //For test purpose we are limiting download 5 per 3 second defined in test environment variable.
    it('should limit download', async function () {
        try {
            const upload_file_path = './test/uploads/test.txt';

            const {publicKey} = await request(app)
                .post('/files')
                .attach('file', upload_file_path)
                .set("Content-Type", "multipart/form-data")
                .then(function (response) {
                    return response.body;
                });

            await Promise.all([
                ...Array.from({length: daily_usages.DOWNLOAD_LIMIT},
                    () => request(app).get(`/files/${publicKey}`)
                ),
            ]);

            return request(app).get(`/files/${publicKey}`).expect(429);

        } catch (e) {
            console.error(e);
        }
    });
});
