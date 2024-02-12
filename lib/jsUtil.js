import fs from "fs";

function convertNumbers(numbers) {
  if (numbers instanceof String) {
    return numbers;
  } else if (Array.isArray(numbers)) {
    let final = [];
    const l = numbers.length;
    for (var i = 0; i < l; i++) {
      let str = "";
      if (Array.isArray(numbers[i])) {
        str += numbers[i].join(":");
      } else {
        str = numbers[i].toString();
      }
      final.push(str);
    }

    return final.join(",");
  } else {
    if (numbers == null || numbers == undefined) {
      return "";
    }
    return numbers.toString();
  }
}

export default {
  deepCopy(data, hash = new WeakMap()) {
    if (typeof data !== "object" || data === null) {
      throw new TypeError("传入参数不是对象");
    }
    // 判断传入的待拷贝对象的引用是否存在于hash中
    if (hash.has(data)) {
      return hash.get(data);
    }
    let newData = {};
    const dataKeys = Object.keys(data);
    dataKeys.forEach((value) => {
      const currentDataValue = data[value];
      // 基本数据类型的值和函数直接赋值拷贝
      if (typeof currentDataValue !== "object" || currentDataValue === null) {
        newData[value] = currentDataValue;
      } else if (Array.isArray(currentDataValue)) {
        // 实现数组的深拷贝
        newData[value] = [...currentDataValue];
      } else if (currentDataValue instanceof Set) {
        // 实现set数据的深拷贝
        newData[value] = new Set([...currentDataValue]);
      } else if (currentDataValue instanceof Map) {
        // 实现map数据的深拷贝
        newData[value] = new Map([...currentDataValue]);
      } else {
        // 将这个待拷贝对象的引用存于hash中
        hash.set(data, data);
        // 普通对象则递归赋值
        newData[value] = deepCopy(currentDataValue, hash);
      }
    });
    return newData;
  },

  // 将脚本中的数字转换为页面上显示的字符串
  // 例如: [100,200] => 100,200
  // [[100,200],[120,230]] => 100:200,120:230
  convertNumbersToString(numbers) {
    return convertNumbers(numbers);
  },

  // 转换用户输入的位置,大小等数字类型
  convertUserInputNumbers(strUserInput) {
    if (
      strUserInput === null ||
      strUserInput === undefined ||
      strUserInput === ""
    ) {
      return "";
    }

    const regXY = /,|，/; // 123,234
    const regLG = /:|：/; // 123:234,22:345
    if (regXY.test(strUserInput)) {
      let pos = [];
      let tmp = strUserInput.split(regXY);
      if (regLG.test(tmp[0])) {
        let tmp0 = tmp[0].split(regLG);
        pos.push(parseFloat(tmp0[0]), parseFloat(tmp0[1]));
      } else {
        if (Number.isNaN(parseFloat(tmp[0]))) {
          // 不是数字，可能是： 中心，底部等
          pos.push(tmp[0]);
        } else {
          pos.push(parseFloat(tmp[0]));
        }
      }
      if (regLG.test(tmp[1])) {
        let tmp1 = tmp[1].split(regLG);
        pos.push(parseFloat(tmp1[0]), parseFloat(tmp1[1]));
      } else {
        if (Number.isNaN(parseFloat(tmp[1]))) {
          // 不是数字，可能是： 中心，底部等
          pos.push(tmp[1]);
        } else {
          pos.push(parseFloat(tmp[1]));
        }
      }
      return pos;
    } else if (regLG.test(strUserInput)) {
      let pos = [];
      let tmp = strUserInput.split(regLG);
      pos.push(parseFloat(tmp[0]), parseFloat(tmp[1]));
      return pos;
    } else {
      if (Number.isNaN(parseFloat(strUserInput))) {
        // 不是数字，可能是： 中心，底部等
        return strUserInput;
      } else {
        return parseFloat(strUserInput);
      }
    }
  },

  // 保存上传的文件
  async saveUploadedFile(src, dest) {
    const data = await src.arrayBuffer();
    fs.appendFileSync(dest, Buffer.from(data), (err) => {
      if (err) {
        console.log(err);
        return false;
      }
    });
    return true;
  },
};
