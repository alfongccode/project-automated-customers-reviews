from storage.models import User, Product, Review

def create_new_user(username, email, password):
    user = User(
        username=username,
        email=email,
        password=password,
    )
    #user.save()

def create_new_product(name, sku, category, description):
    product = Product(
        name=name,
        sku=sku,
        category=category,
        description=description
    )
    #product.save()

def create_new_review(title, content, rating):
    users = User.objects.all()
    products = Product.objects.all();
    print(users)
    print(products)
    review = Review(
        user=users[0],
        product=products[0],
        title=title,
        content=content,
        rating=rating
    )
    #review.save()
    
async def get_products_list():
    return [product async for product in Product.objects.all().values()]