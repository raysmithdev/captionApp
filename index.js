 var express = require('express')
    , router = express()
    , aws = require('aws-sdk');
var path = require('path');
  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'./index.html'))
  })

  var AWS_ACCESS_KEY = 'AKIAIA5P4GULWT6ZZB6Q'
  var AWS_SECRET_KEY = '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'
  var S3_BUCKET = 'rjs-rekog-test-bucket-2'

  router.get('/sign', function(req, res) {
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

    var s3 = new aws.S3()
    var options = {
      Bucket: S3_BUCKET,
      Key: req.query.file_name,
      Expires: 60,
      ContentType: req.query.file_type,
      ACL: 'public-read'
    }

    s3.getSignedUrl('putObject', options, function(err, data){
      if(err) return res.send('Error with S3')

      res.json({
        signed_request: data,
        url: 'https://s3.amazonaws.com/' + S3_BUCKET + '/' + req.query.file_name
      })
    })
  })

router.listen(3000);

module.exports = router