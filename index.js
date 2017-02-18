function countRule(reg, content) {
  let result, count = 0;
  while ((result = reg.exec(content))) {
    count += 1;
  }
  return count;
}

let over = (feature, compare) => compare.map((item, idx) => feature[idx] >= item).reduce((pre, cur) => pre && cur);

function getDescription(content) {
  let feature = [countErrorHandle(content), countThrowError(content), countComment(content)];
  let log = countLog(content);
  let signature = haveSignature(content);
  if(signature){
    return ['你一定是个非常自信的人，特别是对于自己的代码~', 'https://ws3.sinaimg.cn/large/9150e4e5gw1f9elny9hpkj20k00k0jt9.jpg'];
  }
  if(log){
    return ['看起来你有些粗心呢~~人家要拿小拳拳锤你胸口！！(｡• ︿•̀｡)', 'http://himg2.huanqiu.com/attachment2010/2017/0203/20170203075504403.jpg'];
  }
  if(over(feature, [1, 0, 2])){
    return  ['真是不得啊~ 超级棒的人，送你一个萌妹纸吧', 'https://img.alicdn.com/tps/TB1SQhyPFXXXXbrXXXXXXXXXXXX-370-306.jpg'];
  }
  return getDefaultDescription();
}

function getDefaultDescription() {
  let defaultType = [
    ['代码写的这么可爱, 一定是个男孩子^__^', 'http://img5.imgtn.bdimg.com/it/u=1403919504,3711185559&fm=23&gp=0.jpg'],
    ['你一定是一个好人，送你一朵小红花吧', 'http://p3.pstatp.com/large/7b600093ed857cab562']
  ]
  let rIdx = Math.floor(Math.random() * 2)
  return defaultType[rIdx];
}
function countErrorHandle(content) {
  return countRule(new RegExp("\\}\\s?catch\\s?\\(", "g"), content)
}
function countThrowError(content) {
  return countRule(new RegExp("\\sthrow\\s", "g"), content)
}
function countComment(content) {
  return countRule(new RegExp("(\\/\\/)|\\/\\*\\*", "g"), content)
}
function countLog(content) {
  return countRule(new RegExp("console\\.log|print", "g"), content)
}
function haveSignature(content) {
  return /\*\s*?\@?(author|creator)/.test(content);
}

module.exports = content => getDescription(content)