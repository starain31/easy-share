# easy-share
A file sharing Rest API service


## Dependencies
1. Node.js: v14.17.3
2. Redis:6.2.x
3. Google Cloud Storage.

## Environment Variable
1. `PORT`: for public access port.
2. `PROVIDER`: 'local' for local file storage or 'google' for Google cloud storage.
3. `FOLDER`: where to save files if `PROVIDER` is 'local'
4. `TIME_WINDOW`: time window for API request limit,
5. `UPLOAD_LIMIT`: upload limit for the `TIME_WINDOW`, 
6. `DOWNLOAD_LIMIT`: download limit for the `TIME_WINDOW`,
7. `CONFIG`: config file path for Google cloud configuration.
8. CONFIG file format: A JSON file with the following format.
    ```json
        {
            "keyFilename": "<path to google cloud storage authentication file>",
            "bucketName": "<name of the bucket>"
       }
    ```
## Install
    npm install

## Test 
    npm test

## Run
    npm start
