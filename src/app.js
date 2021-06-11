const path = require('path')//It helps to access and interact with the other files or file systems
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()// It stores this application
const port = process.env.PORT || 3000

const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')//customization of views directory
const partialsPath = path.join(__dirname, '../templates/partials')


//Setup static directory to server
app.use(express.static(publicDirectory))//with this the data in html file will be displayed on the webpage!

app.set('view engine','hbs')//It creates handlebar engine
//A template engine enable you to use static template files in your application. At runtime, the template engines replaces 
//variables in a template file with actual values, these handlebaars basically crates a dynamic template that uses basic html
app.set('views', viewsPath)//views is pointing to viewsPath directory
hbs.registerPartials(partialsPath)




//express expects all our templates to be in views folder, however, we can customize it!
app.get('', (req, res) => {
    res.render('index',{//index is the name of the view
        title: 'Weather',
        name: 'Divya'
    })
})

app.get('/about',(req, res) => {
    res.render('about', {
        title: 'About Me!',
        name: "Divya"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        description: "What can I help you with",
        name: 'Divya'
    })
})

app.get('', (req, res) => {
    res.send('<h1>dsWeather</h1>')
})

// app.get('/weather', (req, res) => {
//     res.send({
//         place_name: 'Jodhpur',
//         forecast: 'It is sunny',
//         rain: "No chances of rain",
//         temperature: 35
//     })
// })

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide the address'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })
})

// app.get('/products', (req, res) => {
    
//     if(!req.query.search){
//         return res.send({
//             error: 'You must provide a search term'
//         })
//     }
//     res.send({
//         products: []
//     })
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Divya',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {//wildcard is used here, in order to get the page that has not been mentioned in the above routes
    res.render('404',{
        title: '404',
        name: 'Divya',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
}) //it starts the server and it listens to the specific port
