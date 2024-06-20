
function validateForm(form) {
    let inputs = form.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value === "") {
            alert("请填写所有必填字段");
            return false;
        }
    }
    var agreeCheckbox = document.querySelector("#basic_checkbox_1");
    if (agreeCheckbox && !agreeCheckbox.checked) {
        alert("请勾选同意复选框");
        return false;
    }

    var password1 = document.querySelector("#pwd");
    var password2 = document.querySelector("#pwd_verification");

    if (password1 && password2 && password1.value !== password2.value) {
        alert("两次输入的密码不一致，请重新输入");
        return false;
    }

    var user = document.querySelector("#user");
    var phoneNumberPattern = /^\d{11}$/;

    let page_name = window.location.pathname.replace(/^\//,'').split(/[\/\.\#\?]/)[0]
    console.log(user.value,user.value=="1")
    if (page_name == 'register' && user && window.location.href && !phoneNumberPattern.test(user.value) && user.value != "1" ) {
        alert("请输入有效的手机号");
        return false;
    }

    return true;

}

var form = document.querySelector("form");
form.addEventListener("submit", function (event) {
    if (!validateForm(form)) {
        event.preventDefault();

    }
});


var queryString = window.location.search;
var urlParams = new URLSearchParams(window.location.search);
var message = "";
var info = urlParams.get("info");
if (info =="fail_not_user_or_pwd") {
    message = "注册失败,没有填写用户名或者密码.";
    alert(message);
    window.location.href = "/register";
} else if (info =="fail_user_exists") {
    message = "注册失败,该用户已经存在.";
    alert(message);
    window.location.href = "/register";
} else if (info =="success") {
    alert(`注册成功,账号为: ${urlParams.get('account')}.`);
    window.location.href = "/login";
}
