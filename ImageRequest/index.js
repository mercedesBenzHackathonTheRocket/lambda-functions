module.exports = async function (context, req) {

    const imageFetch = require('./helpers/graphql')
    const helpers = require('../helpers')
    const possibleImagesTypes = ['truck_images', 'driver_images']
    if (possibleImagesTypes.indexOf(req.query.image_type) === -1) {
        context.res = {
            status: 404,
            body: JSON.stringify('Invalid image type!')
        }
        return
    }

    if (req.query.id && helpers.isNumber(req.query.id)) {


        try {
            const res = await imageFetch.getImages(req.query.image_type, req.query.id)
            console.log('sorunnn',res)
            context.res = {
                status: 200,
                body: JSON.stringify(res)
            }
        } catch {
            context.res = {
                status: 404,
                body: JSON.stringify('Invalid request')
            }
        }
        return

    } else {
        context.res = {
            status: 404,
            body: JSON.stringify('Image id should be specified!')
        }

    }
};