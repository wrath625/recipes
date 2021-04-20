from rest_framework.serializers import ModelSerializer

from django.contrib.auth.models import User
from recipes.models import Recipe, Keyword, Step, Ingredient, Procedure, Food, Unit


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username'
        ]


class UnitSerializer(ModelSerializer):

    class Meta:
        model = Unit
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'grams_equivalent',
        ]


class FoodSerializer(ModelSerializer):

    class Meta:
        model = Food
        fields = [
            'id',
            'name',
            'slug',
            'ignore_shopping',
            'description',
        ]


class IngredientSerializer(ModelSerializer):
    food = FoodSerializer()
    unit = UnitSerializer()

    class Meta:
        model = Ingredient
        fields = [
            'id',
            'food',
            'food_note',
            'unit',
            'unit_note',
            'amount',
            'primary',
            'optional',
            'order',
        ]


class ProcedureSerializer(ModelSerializer):
    
    class Meta:
        model = Procedure
        fields = [
            'id',
            'description',
            'order',
        ]



class KeywordSerializer(ModelSerializer):

    class Meta:
        model = Keyword
        fields = [
            'id',
            'name',
            'slug',
            'icon',
            'description',
            'created_time',
            'updated_time',
        ]


class StepSerializer(ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    procedures = ProcedureSerializer(many=True)

    class Meta:
        model = Step
        fields = [
            'id',
            'name',
            'ingredients',
            'procedures',
            'order',
        ]


class RecipeSerializer(ModelSerializer):
    # created_by = UserSerializer()
    deleted_by = UserSerializer(required=False)
    keywords = KeywordSerializer(many=True)
    steps = StepSerializer(many=True)

    class Meta:
        model = Recipe
        fields = [
            'id',
            'name',
            'slug',
            'image',
            'description',
            'servings',
            'servings_text',

            'created_by',
            'created_time',
            'updated_time',

            'is_deleted',
            'deleted_by',
            'deleted_time',

            'working_time',
            'waiting_time',

            'keywords',
            'steps',
        ]
