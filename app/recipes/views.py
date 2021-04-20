from recipes.models import Recipe, Keyword, Food, Unit
from recipes.serializers import RecipeSerializer, KeywordSerializer, FoodSerializer, UnitSerializer
from rest_framework import viewsets, status, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, FileUploadParser
from random import shuffle

class RecipeViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing recipe instances.
    """
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.all().order_by('?')
    # parser_classes = [FileUploadParser, JSONParser]
    # permission_classes = [
    #     permissions.IsAuthenticatedOrReadOnly,
    #     permissions.IsOwnerOrReadOnly
    # ]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'name',
        'keywords__name'
    ]
    lookup_field = 'slug'


class KeywordViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing recipe instances.
    """
    serializer_class = KeywordSerializer
    queryset = Keyword.objects.all()
    lookup_field = 'slug'
    pagination_class = None

class FoodViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing recipe instances.
    """
    serializer_class = FoodSerializer
    queryset = Food.objects.all()
    lookup_field = 'slug'
    pagination_class = None

class UnitViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing recipe instances.
    """
    serializer_class = UnitSerializer
    queryset = Unit.objects.all()
    lookup_field = 'slug'
    pagination_class = None