/*
 * GET customers.
 */
exports.list = function (req, res) {
  console.log('customers: list');
  var query = {
  }
  models.instance.Customer.find(query, { raw: true }, function (err, customers) {
    if (err) {
      console.log('customers: list err:', err);
      res.status(404).send({ msg: err });
    } else {
      console.log('customers: list succ:', customers.length);
      res.render('index', { page_title: "Customers - Node.js", data: customers })
    }
  });
};

/*
 * GET graph.
 */
exports.graph = function (req, res) {
  console.log('customers: graph');
  var input = JSON.parse(JSON.stringify(req.body)).search;
  console.log(input)
  models.instance.Customer.graphQuery('g.V().has("name", name)', { name: "Taco" }, function (err, response) {
    if (err) throw err;
    console.log("query results : " + JSON.stringify(response));
  });
};

exports.search = function (req, res) {
  console.log('customers: search');
  var input = JSON.parse(JSON.stringify(req.body));
  models.instance.Customer.search({
    q: input.search
  }, function (err, customers) {
    if (err) throw err;
    res.render('index', { page_title: "Customers - Node.js", data: customers.hits.hits.map(x => x._source).filter(x => x!=undefined) })
  });
};

exports.add = function (req, res) {
  res.render('add_customer', { page_title: "Add Customers" });
};

exports.edit = function (req, res) {
  var emailid = req.params.email;
  console.log('customers: edit');
  models.instance.Customer.findOne({ email: emailid }, function (err, customer) {
    if (err) {
      console.log('customers: edit err:', err);
      res.status(404).send({ msg: err });
    } else {
      console.log('customers: edit succ:' + JSON.stringify(customer));
      res.render('edit_customer', { page_title: "Edit Customers - Node.js", data: customer });
    }
  });
};

/*Save the customer*/
exports.save = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body));
  var customer = new models.instance.Customer({
    name: input.name,
    address: input.address,
    email: input.email,
    phone: parseInt(input.phone)
  });
  customer.save(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('customers: saved');
  });

  models.instance.Customer.createVertex({ 
    name: input.name, 
    address: input.address,
    email: input.email,
    phone: parseInt(input.phone)
  }, function(err, response) {
    if (err) throw err;
    console.log(response);
});


};

exports.delete_customer = function (req, res) {
  console.log('customers: delete');
  var emailid = req.params.email;
  console.log('customers: edit');
  models.instance.Customer.findOne({ email: emailid }, function (err, customer) {
    if (err) {
      console.log('customers: delete err:', err);
      res.status(404).send({ msg: err });
    } else {
      customer.delete(function (err) {
        console.log('customers: delete err:', err);
      });
    }
  });
};



