from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class RegistrationTests(APITestCase):
	def test_register_success(self):
		url = reverse('register')
		data = {
			'username': 'alice',
			'email': 'alice@example.com',
			'password': 'StrongPass123!',
			'password2': 'StrongPass123!'
		}
		resp = self.client.post(url, data, format='json')
		self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

	def test_register_password_mismatch(self):
		url = reverse('register')
		data = {
			'username': 'bob',
			'email': 'bob@example.com',
			'password': 'pass1',
			'password2': 'pass2'
		}
		resp = self.client.post(url, data, format='json')
		self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
