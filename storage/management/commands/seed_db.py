
import os
import csv
import random
from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from storage.models import Product, Review
from models.sentiment.main import sentiment_analysis
from models.categorizer.main import get_product_classification

User = get_user_model()

class Command(BaseCommand):
    help = "Populate the database with test data (seed)"
    
    def load_data(self, file_dir):
        with open(file_dir, newline="", encoding="utf-8") as file:
            return list(csv.DictReader(file))

    def add_arguments(self, parser):
        parser.add_argument(
            '--flush',
            action='store_true',
            help='Delete the existing data before creating the new data',
        )

    def handle(self, *args, **options):
        if options['flush']:
            self.stdout.write('Deleting existing data...')
            Review.objects.all().delete()
            Product.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

        self.stdout.write('Creating users...')
        users = []
        for i in range(4):
            user, created = User.objects.get_or_create(
                username=f'test{i}',
                defaults={'email': f'test{i}@example.com'}
            )
            if created:
                user.set_password('password123')
                user.save()
            users.append(user)

        products = []
        data = self.load_data(os.path.join(settings.BASE_DIR, "storage", "seed_data", "products.csv"))
        for i, row in enumerate(data):
            self.stdout.write('Creating product...')
            category = get_product_classification({ 'name': row['name'], 'tags': row['categories'] })
            product, _ = Product.objects.get_or_create(
                sku=row['asins'],
                defaults={
                    'name': row['name'],
                    'tags': row['categories'],
                    'category': category,
                    'description': f"Product description {i}",
                }
            )
            products.append(product)

            self.stdout.write('Creating product review...')
            analysis_data = sentiment_analysis({ 'title': row['reviews.title'], 'content': row['reviews.text'] })
            Review.objects.create(
                user=random.choice(users),
                product=product,
                title=row['reviews.title'],
                content=row['reviews.text'],
                rating=row['reviews.rating'],
                sentiment=analysis_data['sentiment']
            )

        self.stdout.write(self.style.SUCCESS(
            f'Seed completed: {len(users)} users, '
            f'{len(products)} products, {Review.objects.count()} reviews.'
        ))