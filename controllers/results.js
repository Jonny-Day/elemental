const Result = require('../models/result')

module.exports = {
    //Result Index
    async getResults(req, res, next){
        let results = await Result.find({})
        res.render('./results/index', { title: 'Results', results });
    },
    //Result New
    newResult(req, res, next){
        res.render('results/new', {title: 'New Result'})
    },
    //Results create
    async createResult(req, res, next){
        //use req.body to create a new post
       let result = await Result.create(req.body);
       res.redirect(`/results/${result.id}`)
    },
    async showResult(req, res, next){
        let result = await Result.findById(req.params.id);
        res.render('results/show', { title: "Result", result })
    }
}