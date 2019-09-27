
# 在这里注册您的模型.
from django.contrib import admin

# 别忘了导入ArticlePost
from .models import ArticlePost

admin.site.register(ArticlePost)
