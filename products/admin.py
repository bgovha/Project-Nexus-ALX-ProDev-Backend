from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'description', 'created_at')
	search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'price', 'stock_quantity', 'category', 'created_by', 'created_at')
	list_filter = ('category',)
	search_fields = ('name', 'description')
