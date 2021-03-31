var zeroFill = require("zero-fill");

const indexCreateFn = (code: string): string => {
  const dateSecond: any = new Date().getSeconds();
  const getSecond: string = dateSecond > 10 ? dateSecond : "0" + dateSecond;
  const _Random = String(Math.floor(Math.random() * 101));
  const fillNumber = zeroFill(3, _Random);
  const itemIndex = `${code}${fillNumber}${getSecond}`;
  return itemIndex;
};

export default indexCreateFn;