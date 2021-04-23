from rest_framework.serializers import ModelSerializer, ImageField
from drf_writable_nested.serializers import WritableNestedModelSerializer
from drf_extra_fields.fields import Base64ImageField
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
            'description'
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


class IngredientSerializer(WritableNestedModelSerializer):
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
            'amount_in_g',
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
            'description',
            'created_time',
            'updated_time',
        ]


class StepSerializer(WritableNestedModelSerializer):
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


class RecipeSerializer(WritableNestedModelSerializer):
    keywords = KeywordSerializer(many=True, required=False)
    steps = StepSerializer(many=True)
    image = Base64ImageField(required=False)

    class Meta:
        model = Recipe
        validators = []
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

            'working_time',
            'waiting_time',

            'keywords',
            'steps',
        ]

    # Using WriteableNestedModelSerializer instead of these:

    # def create(self, validated_data):
    #     keyword_data = validated_data.pop('keywords', [])
    #     step_data = validated_data.pop('steps', [])

    #     recipe = Recipe.objects.create(**validated_data)

    #     for keyword in keyword_data:
    #         keyword_object, _ = Keyword.objects.get_or_create(**keyword)
    #         recipe.keywords.add(keyword_object)

    #     for step in step_data:
    #         ingredient_data = step.pop('ingredients', [])
    #         procedure_data = step.pop('procedures', [])

    #         step_object = Step.objects.create(**step, recipe=recipe)

    #         for ingredient in ingredient_data:
    #             food_data = ingredient.pop('food')
    #             food, _ = Food.objects.get_or_create(**food_data)

    #             unit_data = ingredient.pop('unit')
    #             unit, _ = Unit.objects.get_or_create(**unit_data)

    #             ingredient_object = Ingredient.objects.create(**ingredient, step=step_object, food=food, unit=unit)

    #         for procedure in procedure_data:
    #             procedure_object = Procedure.objects.create(**procedure, step=step_object)

    #     return recipe



    # def update(self, instance, validated_data):
    #     step_serializer = self.fields['steps']
    #     step_data = validated_data.pop('steps', [])
    #     step_data_dict = dict((i.id, i) for i in instance.steps.all())

    #     for step in step_data:
    #         ingredient_serializer = step_serializer.fields['ingredients']
    #         ingredient_data = step.pop('ingredients', [])
    #         ingredient_data_dict = dict((i.id, i) for i in step.ingredients.all())
    #         procedure_serializer = step_serializer.fields['procedures']
    #         procedure_data = step.pop('procedures', [])
    #         procedure_data_dict = dict((i.id, i) for i in step.procedures.all())

    #         if 'id' in step:
    #             step_object = step_data_dict.pop(step['id'])

    #             step_serializer.update(step, step_object)
    #             # for key in step.keys():
    #             #     setattr(step_object, key, step[key])

    #             # step_object.save()
    #         else:
    #             step_object = Step.objects.create(recipe=instance, **step)

    #         for ingredient in ingredient_data:
    #             food_data = ingredient.pop['food']
    #             food, _ = Food.objects.get_or_create(**food_data)
                
    #             unit_data = ingredient.pop('unit')
    #             unit, _ = Unit.objects.get_or_create(**unit_data)

    #             if 'id' in ingredient:
    #                 ingredient_object = ingredient_data_dict.pop(ingredient['id'])
    #                 ingredient_object.food = food
    #                 ingredient_object.unit = unit

    #                 igredient_serializer.update(ingredient, ingredient_object)
    #             else:
    #                 ingredient_object = Ingredient.objects.create(**ingredient, step=step_object, food=food, unit=unit)

    #             if len(ingredient_data_dict) > 0:
    #                 for item in ingredient_data_dict.values():
    #                     item.delete()

    #         for procedure in procedure_data:
    #             if 'id' in procedure:
    #                 procedure_object = procedure_data_dict.pop(procedure['id'])

    #                 procedure_serializer.update(procedure, procedure_object)
    #                 # for key in procedure.keys():
    #                 #     setattr(procedure_object, key, procedure[key])

    #                 # procedure_object.save()
    #             else:
    #                 Procedure.objects.create(**procedure, step=step_object)

    #             if len(procedure_data_dict) > 0:
    #                 for item in procedure_data_dict.values():
    #                     item.delete()

    #         if len(step_data_dict) > 0:
    #             for item in step_data_dict.values():
    #                 item.delete()

    #     return super(UserSerializer, self).update(instance, validated_data)
