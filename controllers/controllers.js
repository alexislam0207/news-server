const { getAllTopics } = require("../models/models")

exports.pathNotFound = (req, res)=>{
    res.status(400).send({msg:'path not found'})
}

exports.getAllApiTopics = (req, res, next)=>{
    getAllTopics()
    .then((topics)=>{
        res.status(200).send({topics})
    })
}
