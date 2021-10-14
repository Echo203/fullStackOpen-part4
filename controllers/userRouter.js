const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { url: 1, author: 1, title: 1 })
    res.json(users)
})

userRouter.post('/', async (req, res) => {
    const body = req.body
    if(!(body.password.length < 4 || body.password)) {
        return res.status(201)
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    res.json(savedUser)
})

module.exports = userRouter