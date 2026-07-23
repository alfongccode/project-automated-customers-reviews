from django.contrib.auth import get_user_model
from storage.models import User, Product, Review

def create_new_user(username, email, password):
    User = get_user_model()
    user, created = User.objects.get_or_create(
        username=username,
        defaults={"email": email}
    )
    if created:
        user.set_password(password)
        user.save()

def create_new_product(name, sku, category, description):
    product = Product(
        name=name,
        sku=sku,
        category=category,
        description=description
    )
    product.save()

async def create_new_review(title, content, rating):
    users = await User.objects.all()
    products = await Product.objects.all();
    print(users)
    print(products)
    review = Review(
        user=users[0],
        product=products[0],
        title=title,
        content=content,
        rating=rating
    )
    await review.asave()
    return review

async def get_users_list():
    return [user async for user in User.objects.all().values()]

async def get_products_list():
    return [product async for product in Product.objects.all().values()]

async def get_reviews_list():
    return [review async for review in Review.objects.all().values()]

async def get_user_reviews_list(user_id):
    return [review async for review in Review.objects.filter(user=user_id).values()]

async def get_products_reviews_list(product_id):
    return [review async for review in Review.objects.filter(product=product_id).values()]