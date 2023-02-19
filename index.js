const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const mongoose = require('mongoose')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('63f230ab0b6bbdbdc2445797')
        req.user = user
        next()
    } catch (e) {
        console.log(e);
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = "mongodb+srv://Ticoran:yx9qtJrbjjPMdPS@cluster0.ly4qnra.mongodb.net/shop"
        mongoose.set('strictQuery', true)
        await mongoose.connect(url, {useNewUrlParser: true})
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'ticoran@gmail.com',
                name: 'Ticoran',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, 'localhost')
    } catch (e) {
        console.log(e)
    }
    
}

start()

