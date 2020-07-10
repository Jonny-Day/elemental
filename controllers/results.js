const Result = require('../models/result')

module.exports = {
    //Result Index
    async resultsIndex(req, res, next){
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
       let result = await Result.create(req.body.result);
       res.redirect(`/results/${result.id}`)
    },
    //Result show
    async showResult(req, res, next){
        let result = await Result.findById(req.params.id);
        res.render('results/show', { title: "Result", result })
    },
    //Result edit
    async editResult(req, res, next){
        let result = await Result.findById(req.params.id);
        res.render('results/edit', { title: "Result", result })
    },
    async updateResult(req, res, next){
        let result = await Result.findByIdAndUpdate(req.params.id, req.body.result);
        res.redirect(`/results/${result.id}`, { title: "Result", result })
    },
    async destroyResult(req, res, next){
        await Result.findByIdAndRemove(req.params.id);
        res.redirect('/results');
    }
}