const express = require('express');
const router = express.Router();
const {Account} = require("../db");
const {Request} = require("../db");
const {User} = require("../db");
const { authMiddleware } = require('../middleware');
const { default: mongoose } = require('mongoose');

router.get("/balance", authMiddleware, async (req,res) => {
    const account = await Account.findOne({
        userId : req.userId
    });

    res.status(200).json({
        balance : account.balance
    })
})


router.post("/transaction", authMiddleware, async (req, res) => {
    const { to, amount } = req.body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const sender = await Account.findOne({ userId: req.userId }).session(session);
        if (!sender) {
            await session.abortTransaction();
            session.endSession();  // End session after aborting
            return res.status(400).json({ msg: "Invalid sender" });
        }

        if (sender.balance < amount) {
            await session.abortTransaction();
            session.endSession();  // End session after aborting
            return res.status(400).json({ msg: "Insufficient balance!" });
        }

        const receiver = await Account.findOne({ userId: to }).session(session);
        if (!receiver) {
            await session.abortTransaction();
            session.endSession();  // End session after aborting
            return res.status(400).json({ msg: "Receiver does not exist!" });
        }

        // Perform the transaction
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        


        // Updating the Request Table in DB!
        // List all the requests in db for this ID and sort them descending manner (amount wise)
        // Keep eliminating the request till the transaction amount is paid for
        // if last request is partially fulfillled update that request!

        // mongoose.set('debug', true);
        
        const reqs = await Request.find({ 
            $and: [
                { to_userId : req.userId },
                { from_userId : to }
              ]
        }).session(session);
        reqs.sort((r1, r2) => r2.amount - r1.amount); 
        console.log("All : " + reqs);


        let remainingAmount = amount; 
        for (let i = 0; i < reqs.length; i++) {
            if (remainingAmount >= reqs[i].amount) {
                remainingAmount -= reqs[i].amount; 
                console.log("Deleted : " + reqs[i]);
                await Request.deleteOne({ _id: reqs[i]._id }).session(session);
            } else {
                reqs[i].amount -= remainingAmount; 
                remainingAmount = 0; 
                await reqs[i].save({ session });
                console.log("Updated : " + reqs[i]);
                break; 
            }
        }

        if (remainingAmount > 0) {
            console.log("Transaction amount exceeded the sum of requests");
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        res.json({ msg: "Transaction completed successfully!" });


    } catch (error) {
        await session.abortTransaction();
        session.endSession();  
        res.status(500).json({ msg: "Transaction failed!", error: error.message });
    }
});

router.post("/request", authMiddleware, async (req, res) => {
    const { to_userId, amount } = req.body; // from request
    const from_userId = req.userId; // from middleware
    try {
        const sender = await Account.findOne({ userId: from_userId });
        if (!sender) {
            return res.status(400).json({ msg: "Invalid sender" });
        }
        const receiver = await Account.findOne({ userId: to_userId });
        if (!receiver) {
            return res.status(400).json({ msg: "Receiver does not exist!" });
        }
        await Request.create({
            from_userId : from_userId,
            to_userId : to_userId,
            amount : amount
        })
        res.json({ msg: "Request Posted Successfully" });
    } 
    catch (error) {
        res.status(500).json({ msg: "Transaction failed!", error: error.message });
    }
});

router.get("/settle", authMiddleware, async (req, res) => {
    const userId = req.userId; // from middleware
    try {
        const filtered_records = await Request.find({
            $or: [
              { to_userId : userId },
              { from_userId : userId }
            ]
          })

        if (!filtered_records) {
            return res.status(400).json({ msg: "No Requests Pending!" });
        }

        const reckonings = [];
        for (let i = 0; i < filtered_records.length; i++) {
            const temp = filtered_records[i];
            
            if (temp.from_userId == userId) {
                const res2 = await User.findOne({_id : temp.to_userId});
                const to_username = res2.firstname + " " + res2.lastname;

                const t1 = reckonings.find((reckoning)=>{
                    return (reckoning.id.toString() === temp.to_userId.toString());
                })

                if(t1){
                    t1.amount += temp.amount;
                }
                else{
                    const reckoning = {};
                    reckoning.amount = temp.amount;
                    reckoning.id = temp.to_userId;
                    reckoning.to_name = to_username;
                    reckonings.push(reckoning);
                }

            } else {
                const res3 = await User.findOne({_id : temp.from_userId});
                const to_username = res3.firstname + " " + res3.lastname;

                const t1 = reckonings.find((reckoning)=>{
                    return (reckoning.id.toString() === temp.from_userId.toString());
                })

                if(t1){
                    t1.amount -= temp.amount;
                }
                else{
                    const reckoning = {};
                    reckoning.amount = (-1) * temp.amount;
                    reckoning.id = temp.from_userId;
                    reckoning.to_name = to_username;
                    reckonings.push(reckoning);
                }
            }
        }

        return res.status(200).json(reckonings);
    } 
    catch (error) {
        res.status(500).json({ msg: "Request Retrieval Failed!", error: error.message });
    }
});


module.exports = router