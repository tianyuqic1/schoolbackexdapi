const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router/router')
//解决跨域
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use('/api',router)
app.use(function (err, req, res, next) {
  if (err) {
    res.send(err.message)
  }
  else {
    next();
  }
})
app.listen(80, () => {
  console.log('服务器启动成功');
})