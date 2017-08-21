var mongoose = require('mongoose'),
    schemas  = require('./models'),
    config   = require('../../config.json')

mongoose.connect(config.user_db)

module.exports = {
    // insert data to tables!
    insert: function(table, data, cb) {
        var _table_instance = new (mongoose.model(table, schemas[table],table))
        for (var item in data) {
            _table_instance[item] = data[item]
        }
        _table_instance.save(function(err){ cb&&cb(err)})
    },

    update: function(table,conditions,params,upsert,cb) {
        var _model = mongoose.model(table,schemas[table],table)
        _model.update(conditions,params,{multi: true, upsert: (typeof upsert === 'boolean' ? upsert : true) },function(err,results) {
            cb&&cb(err,results)
        })
    },

    find: function(table,params,page,pagelength,cb) {
        var _model = mongoose.model(table,schemas[table],table)
        if (typeof page === 'number' && typeof pagelength === 'number') {

        }
        _model.find(params,function(err,results){
            typeof page === 'function' ? page(err, results) : 0
            typeof cb === 'function' ? cb&&cb(err, results) : 0
        })
    },

    count: function(table,params,cb) {
        var _model = mongoose.model(table,schemas[table],table)
        _model.count(params,function(err,results){
            cb&&cb(err,results)
        })
    },
}
