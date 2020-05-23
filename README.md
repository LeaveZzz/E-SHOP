# E-SHOP
* 网上服装商城系统

## 项目地址
* gitee地址[点击进入](https://gitee.com/leaveHao/E-SHOP.git)

## 技术栈
* 本项目采用前后端分离的开发方式，使用的技术栈是:Vue+Node+MongoDB
* 前端：用vue-cli搭建，使用vue全家桶+element-ui
* 后端：express框架
* 数据库：mongodb

## 基本功能

### 普通用户
* 注册、登录
* 根据关键词对商品模糊搜索
* 根据分类查询商品 
* 商品详情展示 
* 加入购物车及创建订单 
* 商品评论 
* 用户个人中心（修改个人信息及查看订单）

### 管理员
* 登录 
* 用户管理 
* 权限管理 
* 商品管理 
* 订单管理 
* 数据统计

## 项目展示
**图片若无法显示请刷新页面或稍后再试**
#### 客户端主页
![客户端主页](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/client_home.png)
#### 注册/登录
![用户登录](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/user_reg.png)
![用户注册](https://images.gitee.com/uploads/images/2020/0523/175840_9b968ef2_5500758.png)
#### 分类浏览
![分类浏览](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/user_goodslist.png)
#### 商品详情
![商品详情](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/user_goodsdetail.png)
#### 购物车
![购物车](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/user_shopcart.png)
#### 创建订单
![创建订单](https://images.gitee.com/uploads/images/2020/0523/175840_acf2bbe8_5500758.png)
#### 个人信息管理
![个人信息管理](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/user_profile.png)
#### 订单列表
![订单列表](https://images.gitee.com/uploads/images/2020/0523/175840_60ab5af8_5500758.png)
#### 用户管理
![用户管理](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/admin_userlist.png)
#### 权限管理
![权限管理](https://images.gitee.com/uploads/images/2020/0523/175840_550906d9_5500758.png)
#### 商品管理
![商品管理](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/admin_goodslist.png)
#### 分类列表
![分类列表](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/admin_catelist.png)
#### 订单管理
![订单管理](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/admin_orderlist.png)
#### 数据统计
![数据统计](https://raw.githubusercontent.com/leaveHao/Picturebed/master/shopMall/admin_datalist.png)

## 运行
### 服务器端
**项目后端服务器是基于node、mongodb开发，运行前请确认系统已安装相关应用**
* `npm install` 安装依赖 
* 将`web-serve/db/shopmall`文件夹下的数据导入到`MongoDB`数据库中
* 修改`web-server/src/config.js`文件，根据注释按需修改。注册使用了邮箱验证，需要手动开启自己邮箱的POP3/SMTP/IMAP服务，具体过程这里不再赘述。
* `node main.js` 运行服务

### 客户端
* `npm install` 安装依赖
* `npm run serve` 运行服务

### 帮助
**如遇到无法解决的问题可以私信我或者通过邮箱[leavehao@foxmail.com](http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=BGhhZXJhbGVrRGJrfGllbWgqZ2tp)联系我**
