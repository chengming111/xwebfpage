//模拟数据源  将Map转换为普通对象
const dataMap = new Map([
    ['name', '小明'],
    ['employeeID', '1130120'],
    ['department', '技术部'],
    ['occupation', '前端工程师'],
    ['phone-number', '13800138000']
]);

const mapToObject = (map) => {
  let obj = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};

const dataObject = mapToObject(dataMap);
console.log(dataObject);

// 自动填写个人信息
const name = document.getElementById('name');
const employeeID = document.getElementById('employeeID');
const department_occupation = document.getElementById('department-occupation');
const phoneNumber = document.getElementById('phone-number');

name.value = dataObject.name;
employeeID.value = dataObject.employeeID;
department_occupation.value = dataObject.department + ' - ' + dataObject.occupation;
phoneNumber.value = formatPhoneNumber(dataObject['phone-number']);


//格式化电话号码
function formatPhoneNumber(phoneNumber) {
    let input = phoneNumber.replace(/\D/g, ''); // 移除所有非数字字符

    // 限制输入的数字只有十一位
    if (input.length > 11) {
        input = input.slice(0, 11);
    }

    let formattedInput = '';

    // 将号码按三四四的方式分组
    for (let i = 0; i < input.length; i++) {
        if (i === 3 || i === 7) {
            formattedInput += ' ';
        }
        formattedInput += input[i];
    }

    return formattedInput;
}

// 实时格式化电话号码
document.getElementById('phone-number').addEventListener('input', function (e) {
    e.target.value = formatPhoneNumber(e.target.value);
});


// 获取单选组和所有选项
const radioGroup = document.getElementById('radioGroup');
const options = radioGroup.querySelectorAll('.radio-option');
const dots = radioGroup.querySelectorAll('.radio-dot');

const otherInput = document.getElementById('otherInput');
var dataInputValue;

radioGroup.addEventListener('click', function (event) {
    const clickedOption = event.target.closest('.radio-option');
    const attachment_container = document.getElementById('attachment-container');

    if (clickedOption) {
        options.forEach(option => option.querySelector('.radio-dot').classList.remove('selected'));
        clickedOption.querySelector('.radio-dot').classList.add('selected');

        labelElement = clickedOption.querySelector('.radio-label');
        if(labelElement.textContent == '10、其他假别') {
            otherInput.style.display = 'block';
            dataInputValue = otherInput.textContent;
        } else if (labelElement.getAttribute('data-value') >=2 && labelElement.getAttribute('data-value') <= 7) {
            attachment_container.style.display = 'block';
            dataInputValue = labelElement.textContent;
        } else {
            otherInput.style.display = 'none';
            attachment_container.style.display = 'none';
            dataInputValue = labelElement.textContent;
        }

        // 将选中的值存储在data-value属性中
        radioGroup.setAttribute('data-inputValue', dataInputValue);
    }
});


// 转换DOM树为JSON对象
function traverseDOM(element) {
    const dataValueMap = new Map();

    function traverse(element) {
        if(element.hasAttribute("data-inputValue")) {
            dataValueMap.set(element.id, element.getAttribute('data-inputValue'));
        }
        for (let i = 0; i < element.children.length; i++) {
            traverse(element.children[i]);
        }
    }

    traverse(element);
    return dataValueMap;
}



// 提交按钮
const submit = document.getElementById('submit');

//点击提交按钮后触发的事件
submit.addEventListener('click', async(e) => {
    //TODO: 如果提交成功, 弹出框确认提交吗
   const approval_part = document.getElementById('approval-part');
   approval_part.style.display = 'block';


    // 将整个HTML文件转换成JSON对象
//    const jsonObject = traverseDOM(document.documentElement);
    const dataValueMap = traverseDOM(document.documentElement);

    // 将JSON对象转换为字符串
//    const jsonString = JSON.stringify(jsonObject, null, 2);
    const jsonString = JSON.stringify(Object.fromEntries(dataValueMap), null, 2);

    console.log(jsonString);
    // 将数据传给dart
    await window.form.submit(jsonString);
});


const phone = document.getElementById('phone-number');
const reason = document.getElementById('reason');
const permanent_address = document.getElementById('permanent-address');
const current_address = document.getElementById('current-address');
const remark = document.getElementById('remark');

function handleInputChange() {
    phone.setAttribute('data-inputValue', phone.value);
    reason.setAttribute('data-inputValue', reason.value);
    permanent_address.setAttribute('data-inputValue', permanent_address.value);
    current_address.setAttribute('data-inputValue', current_address.value);
    remark.setAttribute('data-inputValue', remark.value);

    window.form.onPhoneInputChanged(phone.value);
}
// 用户输入一改变就调用方法
window.onload = function() {
    phone.addEventListener('input', handleInputChange);
    reason.addEventListener('input', handleInputChange);
    permanent_address.addEventListener('input', handleInputChange);
    current_address.addEventListener('input', handleInputChange);
    remark.addEventListener('input', handleInputChange);
}



//验证是否需要展示 用户输入为空的 错误提示
window.form.isEmptyValue = (phoneNumber) => {
    var phone = document.getElementById('phone-number');
    const isRequired = phone.getAttribute('required');
    if (isRequired && phoneNumber.trim() === "") {
        return true;
    } else {
        return false;
    }
};

const errorMessage = document.getElementById('phoneErrorMessage');
//为元素设置错误提示信息
window.form.setErrorMessageValue = (message) => {
//    var errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
};

//为dart提供 ‘联系方式’ 中用户输入的数据
window.form.getPhoneInputValue = (input) => {
    var phone = document.getElementById('phone');
    return phone.value;
};

//更新元素的 data-value 属性
//function updateDataValue(inputElement) {
//    var inputValue = inputElement.value;
//    inputElement.setAttribute('data-inputValue', inputValue);
//}


// 时间范围的相关设置




