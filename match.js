const match = {}
match.regusermatch = (username,password,res) => {
  if (username.length < 2||username.length>10) {
    throw Error('用户名要在2-10位之间');
  }
 else if(password.length < 6 || password.length > 16) {
    throw Error('密码应在6-16位之间');
}
  else {
    return {success:true}
}
}
module.exports = match;