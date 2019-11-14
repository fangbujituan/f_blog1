"""
date:2019.09.16开始粘贴
1、python -V
2、python -m venv env配置虚拟环境
3、env\Scripts\activate.bat 进入虚拟环境(在项目根目录下运行)
4、安装pip install django==2.1
5、python manage.py runserver 运行Django服务器（在my_blog目录下）
数据迁移
    6、my_blog文件夹下python manage.py makemigrations 测你对模型文件的修改，并且把修改的部分储存为一次迁移
    7、my_blog文件夹下python manage.py migrate  应用迁移到数据库中
8、成功：虽然简陋，但是已经走通了MTV（model、template、view）环路。## 问题安装django后没有数据库db.sqlite3，下次看还能碰到吗？

1、Bootstrap是用于网站开发的开源前端框架
2、优化网页入口

1、安装Markdown：进入虚拟环境pip install markdown
登录：http://127.0.0.1:8000/admin/
2、使用Form表单类发表新文章；优化写文章入口
3、编写删除文章功能
4、安全的方式：CSRF攻击--> CSRF令牌
5、完成修改文章功能
    增加新功能流程：
    1、新建试图函数
    2、编写模板
    3、URL 和入口（路由和添加入口）
2019.09.23
1、用户的登录和登出
2、用户的注册(疑问：为什么我的服务器放置一晚上就报错误，重启后又可以了)
3、用户的删除（删除用户，他的博客也都删除了吗？）
4、重置用户密码

2019.09.24
1、扩展用户信息
2、上传头像图片

2019.9.26
1、利用轮子文章分页
2、统计文章浏览量
3、根据浏览量对最热文章排序
4、简单搜索博客文章
5、简单搜索博客文章
6、渲染Markdown文章目录

2019.9.27
1、在博文中发表评论
    准备工作：
        1、他是独立功能，新建app：python manage.py startapp comment。
        2、app创建成功后，在settings.py中注册。
        3、然后在my_blog/urls.py中注册根路由。
    核心工作：
        1、编写评论的模型

2019.10.21
1、* 基于类的视图
2、设置文章的栏目


"""
'''
关于no such table: main.auth_user__old问题的解决办法：
地址：https://stackoverflow.com/questions/53637182/django-no-such-table-main-auth-user-old

轻松解决此问题，并保持以下步骤：
保持django版本2.1.5（此版本中解决的问题） pip install django==2.1.5
删除SQLite数据库
再次迁移python manage.py makemigrations，然后python manage.py migrate
启动服务器 python manage.py runserver
DONE！
'''

'''
关于Reverse for 'article_delete' not found. 'article_delete' is not a valid view function or pattern name.解决办法
错误位置：acricle\detail.html:confirm_delete():article_delete变量写错了，应该是article_safe_delete
'''