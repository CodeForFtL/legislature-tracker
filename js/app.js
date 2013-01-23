/**
 * Main application container for the Legislature Tracker
 */
LT.Application = Backbone.Router.extend({
  routes: {
    'bill/:bill': 'bill',
    '*defaultR': 'defaultR'
  },

  initialize: function(options) {
    this.options = options;
    
    // Bind to help with some event callbacks
    _.bindAll(this);
    
    // Data cache is used to store loaded models
    // as this data does not change that often
    this.dataCache = {};
    
    // Main view for application
    this.mainView = new LT.MainApplicationView(options);
    this.mainView.loading();
    
    // Get data from spreadsheets
    this.tabletop = Tabletop.init({
      key: this.options.billsSheet,
      simpleSheet: true,
      postProcess: this.parseEBills,
      callback: this.loadEBills,
      callbackContext: this
    });
  },
  
  // Function to call when bill data is loaded
  loadEBills: function(data, tabletop) {
    var thisRouter = this;
    this.categories = new LT.CategoriesCollection();
    this.dataCache.eBills = data;
    
    // Get categories
    _.each(data, function(d) {
      _.each(d.categories, function(c) {
        thisRouter.categories.push({
          id: c,
          name: c
        }); 
      });
    });
    
    // Start application/routing
    this.start();
  },
  
  // Function to parse out any data from the spreadsheet
  // for the bills
  parseEBills: function(row) {
    row.categories = row.categories.split(',');
    row.categories = _.map(row.categories, _.trim);
    return row; 
  },
  
  // Start application (after data has been loaded)
  start: function() {
    // Start handling routing and history
    Backbone.history.start();
  },

  // Default route
  defaultR: function() {
    
  },
  
  // Bill route
  bill: function(bill) {
    var model = LT.utils.getModel('OSBillModel', 'bill_id', bill, this.options);
    LT.utils.fetchModel(model, {
      success: function(bill, data, xhr) {
        //console.log(bill);
      },
      error: this.error
    });
  },
  
  error: function(e) {
    // Handle error
  }
});