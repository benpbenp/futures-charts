var request = require('request');

var sqlite3 = require('sqlite3').verbose();

var moment = require('moment');

var _ = require('underscore');

var db = new sqlite3.Database('db.sql');

db.run("CREATE TABLE IF NOT EXISTS prices "    
        +" (commodity TEXT, contract_month INTEGER, contract_year INTEGER, updated INTEGER, price_date INTEGER, open REAL, high REAL, low REAL, last REAL, change REAL, settle REAL, volume REAL, open_interest REAL) ");

var api = {
    months : ['F', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'U', 'V', 'X', 'Z'],

    commodities : ['cl'],

    commodity_names: {'cl': 'Crude Oil'},

    getData: function getData(commodity, options) {
        
        if(this.commodities.indexOf(commodity) == -1){
            return false;
        }

        options = options || {};
       
        var stmt = db.prepare("SELECT max(updated) max FROM prices WHERE commodity LIKE ?");
        
        stmt.get(commodity, function(error, row){
            if(!row || row.max < Math.floor(Date.now() / 1000) - 86400) {
                for(i in api.months){
                    console.log(i);
                    console.log("Fetching " + commodity + " " + i);
                    api.fetchData(commodity, i, 2015);
                }
            }
        });

        if(options.most_recent == true){
            additional_where = " AND price_date = (SELECT max(price_date) FROM prices WHERE commodity = \"" + commodity + "\")";
        } else {
            additional_where = "";
        }
        var data = [];
        db.all("SELECT * FROM prices WHERE commodity = ? " + additional_where + " ORDER BY price_date asc, contract_year asc, contract_month asc", commodity, function(error, rows){
           
            if(error){
                console.log(error);
            } else {
                for(i in rows){
                    row = rows[i];
                    existing_set = _.find(data, function(item) { return item.price_date == row.price_date; })
                    if( !existing_set) {

                        existing_set = {'price_date': row.price_date, 'data' : []};

                        data.push(existing_set);
                    }
                    existing_set.data.push({x: new Date(row.contract_year, row.contract_month, 15), y: row.settle})
                }
            }
            console.log(data);
            options.callback(data);
        });


    
    //return this.fetchData('CL', 5, 2015);    
    },

    fetchData: function(commodity, month, year){
        var updated_date = Math.floor(Date.now() / 1000);
        if( !process.env.QUANDL_AUTH_TOKEN) {
            throw new Error('QUANDL_AUTH_TOKEN env variable not set');
        }
        var quandl_code = 'CME/' + commodity + this.months[month] + year;

        var url = 'https://www.quandl.com/api/v1/datasets/' + quandl_code + '.json?auth_token=' + process.env.QUANDL_AUTH_TOKEN;

        request.get(url , function(error, response, body){
            if(error){
                console.log(error, response, body);
                return;
            }
            var json = JSON.parse(body);
            for(col_num in json.column_names) {
                switch(json.column_names[col_num].toLowerCase()){
                    case 'date':
                        var date_col = col_num;
                        break;
                    case 'open':
                        var open_col = col_num;
                        break;
                    case 'high':
                        var high_col = col_num;
                        break;
                    case 'low':
                        var low_col = col_num;
                        break;
                    case 'last':
                        var last_col = col_num;
                        break;
                    case 'change':
                        var change_col = col_num;
                        break;
                    case 'settle':
                        var settle_col = col_num;
                        break;
                    case 'volume':
                        var volume_col = col_num;
                        break;
                    case 'open interest':
                        var open_interest_col = col_num;
                        break;
                    default:
                        break;
                }
            }
        
            var stmt = db.prepare("INSERT INTO prices (commodity, contract_month, contract_year, updated, price_date, open, high, low, last, settle, volume, open_interest) VALUES "
                                                    +"( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"); 

        
            for(row_num in json.data){
                price_date = moment(json.data[row_num][date_col], 'YYYY-MM-DD').format('X');
                stmt.run([ commodity, month, year, updated_date, price_date, json.data[row_num][open_col], json.data[row_num][high_col], json.data[row_num][low_col], json.data[row_num][last_col], json.data[row_num][settle_col], json.data[row_num][volume_col], json.data[row_num][open_interest_col] ]);

            }
        });

    }
};

module.exports = api; 
