from rest_framework.routers import DefaultRouter
from recipes import views

router = DefaultRouter()
router.register(r'recipes', views.RecipeViewSet, basename='recipe')
router.register(r'keywords', views.KeywordViewSet, basename='keyword')
router.register(r'foods', views.FoodViewSet, basename='food')
router.register(r'units', views.UnitViewSet, basename='unit')
urlpatterns = router.urls