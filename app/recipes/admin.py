from django.contrib import admin
from nested_inline.admin import NestedStackedInline, NestedTabularInline, NestedModelAdmin
from .models import (Food, Ingredient, Unit, 
                     Recipe, Step, Keyword, Procedure,
                     ShoppingList, ShoppingListEntry, ShoppingListRecipe,
                     )

admin.site.register(Step)

class ProcedureInline(NestedTabularInline):
    model = Procedure
    extra = 0
    fk_name = 'step'

class IngredientInline(NestedTabularInline):
    model = Ingredient
    extra = 0
    fk_name = 'step'


class StepInline(NestedStackedInline):
    model = Step
    extra = 0
    fk_name = 'recipe'
    inlines = [
        IngredientInline,
        ProcedureInline        
    ]

class RecipeAdmin(NestedModelAdmin):
    inlines = [
        StepInline,
    ]

    list_display = ('name', 'created_by')

    @staticmethod
    def created_by(obj):
        return obj.created_by.get_user_name()


admin.site.register(Recipe, RecipeAdmin)

admin.site.register(Unit)
admin.site.register(Food)
admin.site.register(Keyword)


class IngredientAdmin(admin.ModelAdmin):
    list_display = ('food', 'amount', 'unit')


admin.site.register(Ingredient, IngredientAdmin)