from django.contrib.auth import get_user_model

def create_new_user(username, email, password):
    User = get_user_model()
    user, created = User.objects.get_or_create(
        username=username,
        defaults={"email": email}
    )
    if created:
        user.set_password(password)
        user.save()