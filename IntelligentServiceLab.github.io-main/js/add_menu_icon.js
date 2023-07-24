var menuIconMap = {};
menuIconMap["团队成员"] = "fa-user-tie";
menuIconMap["学术成果"] = "fa-newspaper";
menuIconMap["科研项目"] = "fa-flask";
menuIconMap["荣获奖励"] = "fa-trophy";



var hrefMenu = document.getElementsByClassName("site-page");
for(var i = 0; i < hrefMenu.length; i++)
{

    var menuItemText = hrefMenu[i].innerHTML;
    hrefMenu[i].innerHTML = "<i style=\"padding-right: 1px;\" class=\"fas " + menuIconMap[menuItemText.trim()] + "\"></i>" + menuItemText
    console.log(menuItemText);
    var icon = document.createElement('i');
}