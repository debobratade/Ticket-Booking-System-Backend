const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length == 0) return false;
  return true;
};

const isValidRequest = function (data) {
  if (Object.keys(data).length == 0) return false;
  return true;
};

const validName = function (name) {
let res=[]
    name=name.split(' ')
  
    for(let i of name){
      if(i.length>0){
        i=i.trim()
       
        if(/^[a-zA-Z]{2,30}$/.test(i)===false)
        return false
        else
          res.push(i)
         
      }
    }
   name = res.join(' ')
   return name
};

const isValidMail = function (v) {
  return /^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(
    v
  );
};

const isValidMobile = function (num) {
  return /^[6789]\d{9}$/.test(num);
};

const isValidPassword = function (password) {
  if (password.length >= 5 && password.length <= 15) {
    return true;
  }
  return false;
};

const capitalize = function (str) {
  str = str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
  return str;
};

const hr_to_sec = function (date, str) {
  let start = new Date(date)
  let start_seconds = start.getTime() / 1000;

  str=str.split(':')
 
  hts= str[0]*3600
  mts= str[1]*60

  total = hts+mts+start_seconds
 return total 

};

const convert_sec_to_hr = function (secs) {
  var h = Math.floor(secs / 3600);
  var m = Math.floor(secs % 3600 / 60);
  var hour = h > 0 ? h : 0
  var minute = m > 0 ? m : 0
  return hour + minute
}




module.exports = {
  isValid,
  validName,
  isValidMail,
  isValidRequest,
  isValidMobile,
  isValidPassword,
  capitalize,
  hr_to_sec,
  convert_sec_to_hr
};
