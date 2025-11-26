from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.core.management import call_command
from django.contrib.auth import get_user_model
import os


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

	def test_create_admin_command(self):
		"""Create a superuser via the create_admin management command using env vars."""
		User = get_user_model()
		username = 'test_admin'
		# Ensure the user doesn't already exist
		User.objects.filter(username=username).delete()
		# Temporarily set env vars
		os.environ['DJANGO_SUPERUSER_USERNAME'] = username
		os.environ['DJANGO_SUPERUSER_PASSWORD'] = 'ComplexPass123!'
		# Run the command
		call_command('create_admin')
		# Assert user was created
		self.assertTrue(User.objects.filter(username=username).exists())
		# Clean up
		User.objects.filter(username=username).delete()
