const express = require('express');
const router = express.Router();
const routerhandler = require('./routerhandler')
const jwt = require('jsonwebtoken');
const secretKey = 'Kevin^-^';
function authenticateToken(req, res, next) {
  const token = req.body.token;
  if (!token) {
    return res.status(401).send('Missing token');
  }
  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken.username;
    next();
  } catch (err) {
    res.status(403).send('Invalid token');
  }
}
//注册模块
router.post('/reguser', routerhandler.reguser)
//登录模块r
router.post('/login', routerhandler.login)
//保存信息模块
router.post('/save', authenticateToken, routerhandler.saveinfo)
//提交订单模块
router.post('/submitorder', authenticateToken, routerhandler.submitorder)
//管理员端渲染页面模块
router.post('/refleshpage', authenticateToken, routerhandler.refleshpage)
//客户端订单中心页面的渲染
router.post('/shopcenter', authenticateToken, routerhandler.shopcenter)
//确认收货模块
router.post('/confirmreceipt', authenticateToken, routerhandler.confirmreceipt)
//获取用户订单信息模块
router.post('/getshopinfo', authenticateToken, routerhandler.getshopinfo)
//跳转客户端和管理员端的身份认证模块
router.post('/confirmusername',authenticateToken,routerhandler.confirmusername)
module.exports = router;