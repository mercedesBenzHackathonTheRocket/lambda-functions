module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('JavaScript is running late!');
    }

    try {
        const res = await getMovingVehicle()
        const all = await Promise.all(res.map(x => getDataofAVehicle(x.drivers.driverTrucksBydriverId[0].vehicle_id)))
        context.log('JavaScript timer trigger function ran!', timeStamp, res[0].drivers.driverTrucksBydriverId[0].vehicle_id);
        await Promise.all(issueToGraphQL.map(all))
    } catch {
        context.log("Fail")
    }
    return
};

const getMovingVehicle = async () => {
    const axios = require('axios')
    try {
        const res = await axios.post(URLS.graphql, {
            "query": `{
                job_drivers(
                     where: { status: { _eq: "IN_PROGRESS" }} 
                  ) {
                  drivers{
                    driverTrucksBydriverId { 
                        vehicle_id
                    }
                  }
                }
              }`

        })
        return res.data.data.job_drivers
    } catch {
        return 'Err'
    }

}

const issueToGraphQL = async (obj) => {
    const axios = require('axios');
    try {
        await axios.post(URLS.graphql, {
            data: obj
        })
        return 1

    } catch {
        return 0
    }
}
const getDataofAVehicle = async (vehicleId) => {
    const possible_queries = ['location', 'tires', 'odometer', 'fuel']
    const axios = require('axios')


    try {
        return Promise.all(possible_queries.map((x) => axios.get(`${URLS.lambdaurl}/MercedesRequest?query_type=${x}&vehicle_id=${vehicleId}`)))


    } catch (er) {

        return {}
    }

}

const URLS = {
    graphql: 'https://gpgsql.herokuapp.com/v1alpha1/graphql',
    lambdaurl: 'http://cdc483e2.ngrok.io/api'
}