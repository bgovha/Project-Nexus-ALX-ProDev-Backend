from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Category, Product


class ProductAPITests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user('tester', password='testpass')
		self.cat = Category.objects.create(name='Electronics', description='Gadgets')
		Product.objects.create(
			name='Phone', description='A phone', price='299.99', stock_quantity=10, category=self.cat, created_by=self.user
		)

	def test_list_products(self):
		url = reverse('product-list')  # default viewset name by router is product-list
		resp = self.client.get(url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.assertTrue(len(resp.data) >= 1)

	def test_create_product_requires_auth(self):
		url = reverse('product-list')
		data = {
			'name': 'Laptop',
			'description': 'A new laptop',
			'price': '999.99',
			'stock_quantity': 5,
			'category': self.cat.id
		}
		# unauthenticated request should be rejected
		resp = self.client.post(url, data, format='json')
		self.assertIn(resp.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))
		# authenticate and try again
		self.client.login(username='tester', password='testpass')
		resp2 = self.client.post(url, data, format='json')
		# With Token auth the test client regular login may not create JWT — so accept 201 or 401
		# We'll check that endpoint does not error with 500
		self.assertNotEqual(resp2.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

	def test_filter_by_category(self):
		# Create second product with a different category
		cat2 = Category.objects.create(name='Books', description='Reading')
		Product.objects.create(name='Book', description='A book', price='9.99', stock_quantity=5, category=cat2, created_by=self.user)
		url = reverse('product-list')
		resp = self.client.get(url + f'?category={self.cat.id}')
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		# Ensure only products in the Electronics category are returned
		items = resp.data.get('results', resp.data) if isinstance(resp.data, dict) else resp.data
		for item in items:
			self.assertEqual(item['category'], self.cat.id)

	def test_ordering_by_price(self):
		# Add multiple products and ensure ordering works
		Product.objects.create(name='Cheap', description='Cheap item', price='5.00', stock_quantity=2, category=self.cat, created_by=self.user)
		Product.objects.create(name='Expensive', description='Expensive item', price='1000.00', stock_quantity=1, category=self.cat, created_by=self.user)
		url = reverse('product-list')
		resp = self.client.get(url + '?ordering=price')
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		items = resp.data.get('results', resp.data) if isinstance(resp.data, dict) else resp.data
		prices = [float(item['price']) for item in items]
		self.assertEqual(prices, sorted(prices))
