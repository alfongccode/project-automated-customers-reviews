
from fastapi import HTTPException
from storage.models import User, Product, Review, ProductMetadata
from models.summarize.main import summarize_reviews
from models.sentiment.main import sentiment_analysis

async def create_new_user(username, email, password):
    if await User.objects.filter(username=username).aexists():
        raise HTTPException(status_code=409, detail=f"User '{username}' already exists")
    user = await User.objects.acreate_user(username=username, email=email, password=password)
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }

async def create_new_product(brand, name, sku, tags, description):
    from models.categorize.main import get_product_classification
    category = get_product_classification({ 'name': name, 'tags': tags })
    product = Product(
        brand=brand,
        name=name,
        sku=sku,
        tags=tags,
        category=category,
        description=description
    )
    await product.asave()
    return {
        "id": product.id,
        "brand": product.brand,
        "name": product.name,
        "sku": product.sku,
        "tags": product.tags,
        "category": product.category,
        "description": product.description,
        "added_at": product.added_at,
        "updated_at": product.updated_at,
    }
    
async def get_user_by_username(username):
    qs = User.objects.filter(username=username)
    user = await qs.afirst()
    if user is None:
        raise HTTPException(status_code=404, detail=f"User '{username}' not found")
    return user

async def create_new_review(username, product_id, title, content, rating):
    user = await get_user_by_username(username=username)
    await get_product(product_id=product_id)
    analysis_data = sentiment_analysis({ 'title': title, 'content': content })
    review = Review(
        user=user,
        product_id=product_id,
        title=title,
        content=content,
        rating=rating,
        sentiment=analysis_data['sentiment']
    )
    await review.asave()
    try:
        await summarize_product_reviews(product_id=product_id)
    except Exception as e:
        pass

    return {
        "id": review.id,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "join_date": user.created_at
        },
        "product_id": review.product_id,
        "title": review.title,
        "content": review.content,
        "rating": review.rating
    }

async def get_users_list():
    return [user async for user in User.objects.all().values('id', 'username', 'email', 'created_at')]

async def get_user(user_id):
    qs = User.objects.filter(id=user_id).values('id', 'username', 'email', 'created_at')
    user = await qs.afirst()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_products_list():
    return [product async for product in Product.objects.all().values()]

async def get_reviews_list():
    return [review async for review in Review.objects.all().values()]

async def get_review(review_id):
    qs = Review.objects.filter(id=review_id).values('id', 'user_id', 'product_id', 'title', 'content', 'rating', 'sentiment', 'created_at', 'updated_at')
    review = await qs.afirst()
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

async def get_user_reviews_list(user_id):
    return [review async for review in Review.objects.filter(user=user_id).values()]

async def get_products_reviews_list(product_id):
    return [review async for review in Review.objects.filter(product=product_id).values()]

async def get_product(product_id):
    qs = Product.objects.filter(id=product_id).values('id', 'brand', 'name', 'sku', 'tags', 'category', 'description', 'metadata', 'added_at', 'updated_at')
    product = await qs.afirst()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

async def get_product_reviews(product_id):
    return [r async for r in Review.objects.filter(product=product_id).values('title', 'content', 'rating', 'sentiment')]

async def summarize_product_reviews(product_id):
    qs = Product.objects.filter(id=product_id).values('name', 'category', 'description', 'tags')
    product = await qs.afirst()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    reviews = [r async for r in Review.objects.filter(product=product_id).values('title', 'content', 'rating', 'sentiment')]
    result = summarize_reviews(product, reviews)

    await ProductMetadata.objects.aupdate_or_create(
        product_id=product_id,
        defaults={
            'summary': result.get('summary', ''),
            'positive': result.get('positive', ''),
            'negative': result.get('negative', ''),
            'sentiment_counts': result.get('sentiment_counts', {}),
            'total_reviews': len(reviews),
        }
    )
    return result

async def get_review_sentiment(review_id):
    qs = Review.objects.filter(id=review_id).values('id', 'title', 'content')
    review = await qs.afirst()
    if review is None:
        raise HTTPException(status_code=404, detail=f"Review not found with review ID {review_id}")
    return sentiment_analysis({'title': review['title'], 'content': review['content']})
