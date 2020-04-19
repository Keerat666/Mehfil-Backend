const cloudinary = require('cloudinary')

const dotenv = require('dotenv');
const shortid = require('shortid');

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.uploads = (file, folder) => {

    return new Promise((resolve, reject) => {

        let myId = shortid.generate();

        cloudinary.v2.uploader.upload(file,
            {
                resource_type: "auto",
                public_id: `${folder}/${myId}`,
                overwrite: true,
            },
            (error, result) => {
                console.log(result);

                if (error) {

                    reject(error);
                } else {

                    
                    resolve({
                        url: result.url,
                        id: result.public_id
                    })
                }
            });

    })

}