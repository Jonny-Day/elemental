const faker = require('faker');
const Result = require('./models/result');

async function seedResults(){
    await Result.remove({});
    for (const i of new Array(20)){
        const result = {
            lotNumber: faker.lorem.word(),
            chemicalFormula: faker.lorem.word(),
            impurities: faker.lorem.text(),
            author: {
                '_id' : '5f08782f0bd2b52914e44d75',
                'username' : 'jonny'
            }
        } 
        await Result.create(result)
    }
    console.log('20 new posts created')
}

module.exports = seedResults;