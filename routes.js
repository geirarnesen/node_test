module.exports = function(stockRepository) {
  return {
    getCount: function (req, res) {
      stockRepository.getCount(req.params.isbn).then(function (result) {
        if (result !== null) {
          res.status(200).json({count: result});
        } else {
          res.status(404).json({error: 'No book with ISBN: ' + req.params.isbn});
        }
      });
    },
    stockUp: function (req, res, next) {
      stockRepository.
      stockUp(req.body.isbn, req.body.count).
      then(function (result) {
        res.json({isbn: req.body.isbn, count: req.body.count});
      }).
      catch(next);
    },
    findAll: function (req, res, next) {
      stockRepository.
      findAll().
      then(function (books) {
        res.json(books);
      }).
      catch(next);
    }
  };
};