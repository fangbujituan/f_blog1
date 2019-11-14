
from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from article.models import ArticlePost

# 博文的评论
class Comment(models.Model):
    article = models.ForeignKey(
        ArticlePost,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created',)

    def __str__(self):
        return self.body[:20]
    # 获取文章地址
    def get_absolute_url(self):
        return reverse("article:article_detail",  args=[self.id])