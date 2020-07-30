const Result = require('../models/result')

module.exports = {
    //Result Index 
    async resultsIndex(req, res, next){
        // const user = req.user._id
        //turn the thing below into dbQuery
        // {author: [user]}
        const dbQuery = res.locals.dbQuery
        let results = await Result.paginate(dbQuery, {
            page: req.query.page || 1,
            limit: 5
        })
        results.page = Number(results.page)
        res.render('./results/index', { title: 'Results', results, style: '/stylesheets/results.css'});
    },
    postResult(req, res, next){
        
            console.log(req.body);
        
            req.session.data = req.body
            next();          
    },
    //Result New
    newResult(req, res, next){
        console.log('HERE' + req.session.data)
        const data = req.session.data
        res.render('results/new', {title: 'New Result', style: '/stylesheets/home.css', data})
    },
    //Results create
    async createResult(req, res, next){
        //Link the user to the result
       req.body.result.author = req.user._id;

       let result = await Result.create(req.body.result);
       
       req.session.success = 'Result added successfully!'
       res.redirect(`/results/${result.id}`);
      
    },
    //Result show
    async showResult(req, res, next){
        let result = await Result.findById(req.params.id).populate({
            path: 'author',
            
            model: 'Chemist'
        });
        res.render('results/show', { title: "Result", result, style: '/stylesheets/home.css' })
    },
    //Result edit
    async editResult(req, res, next){
        let result = await Result.findById(req.params.id);
        res.render('results/edit', { title: "Result", result, style: '/stylesheets/home.css' })
    },
    async updateResult(req, res, next){
        let result = await Result.findByIdAndUpdate(req.params.id, req.body.result);
        res.redirect(`/results/${result.id}`)
    },
    async destroyResult(req, res, next){
        await Result.findByIdAndRemove(req.params.id);
        req.session.success = 'Result deleted successfully!'
        res.redirect('/results');
    
    }
}