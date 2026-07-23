from django.contrib.auth import get_user_model
from storage.models import User, Product, Review
from models.categorizer.main import get_product_classification

async def create_new_user(username, email, password):
    User = get_user_model()
    user, created = User.objects.get_or_create(
        username=username,
        defaults={"email": email}
    )
    if created:
        user.set_password(password)
        await user.asave()
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }

async def create_new_product(name, sku, tags, description):
    category = get_product_classification({ 'name': name, 'tags': tags })
    product = Product(
        name=name,
        sku=sku,
        tags=tags,
        category=category,
        description=description
    )
    await product.asave()
    return {
        "id": product.id,
        "name": product.name,
        "sku": product.sku,
        "tags": product.tags,
        "category": product.category,
        "description": product.description,
        "added_at": product.added_at,
        "updated_at": product.updated_at,
    }

async def create_new_review(title, content, rating):
    users = await User.objects.all()
    products = await Product.objects.all();
    review = Review(
        user=users[0],
        product=products[0],
        title=title,
        content=content,
        rating=rating
    )
    await review.asave()
    return {
        "id": review.id,
        "user": review.user,
        "product": review.product,
        "title": review.title,
        "content": review.content,
        "rating": review.rating
    }

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