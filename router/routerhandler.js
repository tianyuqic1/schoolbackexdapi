//导出路由所需要的函数
const express = require('express')
const routerhandler = {};
const match = require('../match')
const db = require('../mydb')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
//定义token加密的规则
const jwtsecreate='Kevin^-^'
//注册模块函数
routerhandler.reguser = (req, res) => {
  //1、首先校验注册是否合法
  console.log(req.body.username)
match.regusermatch(req.body.username, req.body.password);
  //2、然后查询数据库是否有相同的用户名
  db.query('select * from shop where username=?', req.body.username, (err, result) => {
    if (err) {
      throw Error(err.message)
    }
    else {
      if (result.length>0) {
        res.send('已有该用户名，请重新注册');
      }
        //3、上述两个条件都满足，允许注册，将密码加密，和用户名一起返回给数据库
      if (result.length == 0) {
        //先对密码加密
        let password = bcrypt.hashSync(req.body.password, 10);
        //再进行数据的插入
        db.query('insert into shop set ?', {username:req.body.username,password:password}, (err, result) => {
          if (err) {
            res.send(err.message);
          }
          else {
            res.send({
              statue: 0,
              msg: '注册成功',
            })
          }
      })
  
    }
    }
})
}
//登录接口
routerhandler.login = (req,res) => {
  db.query('select password from shop where username=?', [req.body.username], (err, result) => {
    if (err) {
    throw Error(err.message)
  }
    else {
      
      if (result.length == 0) {
res.send('用户名未被注册')
}
      else {
        if (bcrypt.compareSync(req.body.password, result[0].password)) {
          //定义要加密的字符串
          const payload = {
            username: req.body.username//数据较少，主要是问了模拟token认证机制,这里就对用户名进行加密
          }
          const tokenstr= jwt.sign(payload,jwtsecreate,{expiresIn:'10h'})
          res.send({
            status: 0,
            msg: '登录成功',
            token: tokenstr,
            username:req.body.username//主要是后续用来判断是不是管理员
          })
        }
        else {
          res.send('密码错误，请重新输入')
}
}
}
})  
}
//保存用户数据
routerhandler.saveinfo = (req, res) => {
  //要求客户端发送 用户名，住址，电话
  db.query('update shop set phonenumber=?,position=? where username=?', [req.body.phonenumber, req.body.position, req.user], (err, result) => {
    if (err) {
      res.send(err.message)
    } else {
      res.send('更新成功')
    }
  })
}
//提交订单数据
//要提交的内容有 1、书名，2、数量 3、总价  客户端返回一个数组 例[{张宇考研数学*2},{嵌入式*3}，total(总价)]
routerhandler.submitorder = (req,res) => {
  db.query('update shop set shopinfo =? where username=?', [req.body.shopinfo, req.user], (err, result) => {
    if (err) {
      res.send(err.message);
  }
    else {
      res.send('提交订单成功')
}
})
}
//管理员端刷新页面所要获取到的数据
routerhandler.refleshpage = (req, res) => {
  db.query('select * from shop', (err, result) => {
    if (err) {
    res.send(err.message)
  }
    else {
      res.send(result);
}
})
}
//客户端订单中心的渲染
routerhandler.shopcenter = (req, res) => {
  db.query('select * from shop where username=?',req.user,(err, result) => {
    if (err) {
      res.send(err.message)
    }
    else {
      res.send(result);
}
  })
}
//确认收货
routerhandler.confirmreceipt = (req, res) => {
  db.query('update shop set shopinfo = null where username =?', req.user, (err, result) => {
    if (err) {
      res.send(err.message)
    }
    else {
      res.send('确认收货成功');
}
  })
}
//管理员端页面渲染时所需要的信息
routerhandler.getshopinfo = (req, res) => {
  db.query('select * from shop where username=?', req.user, (err, result) => {
    if (err) {
      res.send(err.message)
    }
    else {
      res.send(result)
    }
  })
}
//页面跳转鉴权
routerhandler.confirmusername = (req,res) =>{
  res.send(req.user);
}
module.exports = routerhandler;