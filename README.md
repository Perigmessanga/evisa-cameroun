deploy test







git add backend/scripts/populate\_master\_data.py

git commit -m "Ajout du script de population des types de visa et templates email"

git push origin charles  





docker exec -it event\_api\_prod python manage.py shell -c "from apps.authentication.models import CustomUser; CustomUser.objects.create\_superuser(email='awards@gmail.com', password='AwardsPass123!', username='admin', role='admin', is\_email\_verified=True)"





