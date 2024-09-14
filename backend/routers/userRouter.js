const express = require('express');
const router = express.Router();
const z = require('zod');
const {User, Account} = require('../db');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const {authMiddleware} = require('../middleware');



 
const userSchemaSignup = z.object({
    username : z.string(),
    firstname : z.string(),
    lastname : z.string(),
    password : z.string()
});

const userSchemaSignin = z.object({
    username : z.string(),
    firstname : z.string().optional(),
    lastname : z.string().optional(),
    password : z.string()
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    const { success, error } = userSchemaSignup.safeParse(body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid input",
            details: error.errors
        });
    }

    try {
        const flag = await User.findOne({ username: body.username });
        if (flag && flag._id) {
            return res.status(409).json({
                message: "Username already taken"
            });
        }

        const user = await User.create({
            username: body.username,
            firstname: body.firstname,
            lastname: body.lastname,
            password: body.password
        });

        const account = await Account.create({
            userId: user._id,
            balance: 1 + Math.random() * 1000
        });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        return res.status(201).json({
            message: "User created successfully",
            token: token
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => ({
                field: e.path,
                message: e.message
            }));
            return res.status(400).json({
                message: "Validation failed",
                errors: errors
            });
        }
        console.error(err);
        return res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
});



router.post("/signin", async (req, res) => {
    const body = req.body;

    const { success, error } = userSchemaSignin.safeParse(body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid input",
            details: error.errors
        });
    }

    try {
        const user = await User.findOne({ username: body.username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        return res.json({
            token: token
        });
    } catch (err) {
        console.log("Signin Error");
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => ({
                field: e.path,
                message: e.message
            }));
            return res.status(400).json({
                message: "Validation failed",
                errors: errors
            });
        }
        console.error(err);
        return res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
});


const optionalUser = z.object({
    firstname : z.string().optional(),
    lastname : z.string().optional(),
    password : z.string().optional()
})

router.put("/",authMiddleware, async (req,res) => {
    const body = req.body;
    const {success} = optionalUser.safeParse(body);
    if(!(success)){
        return res.status(411).json({
            message: "Error while updating the information. "
        });
    }
    const userId = req.userId;
    
    const updateFields = {};
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.password) updateFields.password = req.body.password;
    if (req.body.firstname) updateFields.firstname = req.body.firstname;
    if (req.body.lastname) updateFields.lastname = req.body.lastname;
    
    const flag = await User.findOneAndUpdate({ _id: userId }, updateFields);

    return res.status(200).json({
        message: "Updated successfully"
    })

})

router.get("/bulk",authMiddleware, async (req, res) => {
    const filter = req.query.filter.toLowerCase() || "";

    const users = await User.find({
        $expr: {
            $regexMatch: {
                input: { $toLower: { $concat: ["$firstname", " ", "$lastname"] } },
                regex: filter
            }
        },
        _id: { $ne: req.userId }
    });

    return res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname,
            _id: user._id
        }))
    })
})

router.get("/me",authMiddleware, async (req, res) => {
    const user = await User.findOne({
        _id : req.userId
    });
    return res.status(200).json({
        username : user.username,
        password : user.password,
        firstname : user.firstname,
        lastname : user.lastname
    });
})


module.exports = router;