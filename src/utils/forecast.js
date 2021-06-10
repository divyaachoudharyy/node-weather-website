const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=0a8ac5f30d48fd0475eaa69f8bf0d021&query='+encodeURIComponent(latitude)+','+encodeURIComponent(longitude)+'&units=f'

    request({url, json: true}, (error, {body}) => {
        if(error){
            callback('Unable to access the location services!', undefined)
        }else if(body.error){
            callback('Unable to find the location. Try again!', undefined)
        }else{
            callback(undefined, 'It is currently ' + body.current.temperature + ' degrees. It is '+ body.current.weather_descriptions[0])
        }
    })
}


module.exports = forecast