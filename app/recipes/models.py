from django.db import models, transaction
from django.db.models import F, Max
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
from autoslug import AutoSlugField


class Food(models.Model):
    name = models.CharField(max_length=128, validators=[MinLengthValidator(1)])
    slug = AutoSlugField(unique=True, populate_from='name', always_update=True)
    ignore_shopping = models.BooleanField(default=False)
    description = models.TextField(default='', blank=True)

    def __str__(self):
        return self.name


class Unit(models.Model):
    name = models.CharField(max_length=128, validators=[MinLengthValidator(1)])
    slug = AutoSlugField(unique=True, populate_from='name', always_update=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class AutoOrder():
    def save(self, *args, **kwargs):
        if not self.pk:
            with transaction.atomic():
                # Only for create
                results = type(self).objects.filter(step=self.step or self).aggregate(Max('order'))

                current_order = results['order__max']
                if current_order is None:
                    current_order = 0

                value = current_order + 1
                self.order = value
        else:
            if type(self).objects.filter(order=self.order):
                type(self).objects.filter(order__gte=self.order).update(order=F('order') + 1)
        super().save(*args, **kwargs)


class Ingredient(AutoOrder, models.Model):
    food = models.ForeignKey(Food, on_delete=models.PROTECT, null=True, blank=True)
    food_note = models.CharField(max_length=256, null=True, blank=True)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT, null=True, blank=True)
    unit_note = models.CharField(max_length=256, null=True, blank=True)
    amount = models.DecimalField(default=0, decimal_places=2, max_digits=32)
    amount_in_g = models.DecimalField(default=None, null=True, blank=True, decimal_places=2, max_digits=32)
    primary = models.BooleanField(default=False)
    optional = models.BooleanField(default=False)
    order = models.IntegerField(default=1)
    step = models.ForeignKey('Step', related_name="ingredients", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.food} {self.amount} {self.unit}"

    class Meta:
        ordering = ['order', 'pk']
        index_together = ('step', 'order')


class Procedure(AutoOrder, models.Model):
    description = models.TextField(default='')
    order = models.IntegerField(default=1)
    step = models.ForeignKey('Step', related_name="procedures", on_delete=models.CASCADE)

    class Meta:
        ordering = ['order', 'pk']
        index_together = ('step', 'order')

    def __str__(self):
        return f"({self.id}) {self.description}"


class Step(models.Model):
    name = models.CharField(max_length=128, default='', blank=True)
    order = models.IntegerField(default=1)
    recipe = models.ForeignKey('Recipe', related_name="steps", on_delete=models.CASCADE)

    class Meta:
        ordering = ['order', 'pk']
        index_together = ('recipe', 'order')

    def __str__(self):
        return f"[{self.recipe.name}] ({self.order}) {self.name}"


class Keyword(models.Model):
    name = models.CharField(max_length=64)
    slug = AutoSlugField(unique=True, populate_from='name', always_update=True)
    description = models.TextField(default="", blank=True)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


def recipe_image_path(instance, filename):
    path, ext = filename[-5:].split('.', 1)
    return f"images/recipes/{instance.slug}.{ext}"


class Recipe(models.Model):
    name = models.CharField(max_length=128)
    slug = AutoSlugField(unique=True, populate_from='name', always_update=True)
    image = models.ImageField(upload_to=recipe_image_path, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    servings = models.IntegerField(default=1)
    servings_text = models.CharField(default='', blank=True, max_length=32)

    created_by = models.CharField(max_length=128)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)
    deleted_by = models.ForeignKey(User, blank=True, null=True, related_name='+', on_delete=models.SET_NULL)
    deleted_time = models.DateTimeField(blank=True, null=True)

    working_time = models.IntegerField(default=0)
    waiting_time = models.IntegerField(default=0)

    keywords = models.ManyToManyField(Keyword, blank=True)
    

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['pk']


class ShoppingListRecipe(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, null=True, blank=True)
    servings = models.DecimalField(default=1, max_digits=8, decimal_places=4)

    def __str__(self):
        return f'Shopping list recipe {self.recipe.name}'


class ShoppingListEntry(AutoOrder, models.Model):
    list_recipe = models.ForeignKey(ShoppingListRecipe, on_delete=models.CASCADE, null=True, blank=True)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(default=0, decimal_places=16, max_digits=32)
    order = models.IntegerField(default=1)
    checked = models.BooleanField(default=False)

    def __str__(self):
        return f'Shopping list entry {self.id}'


class ShoppingList(models.Model):
    note = models.TextField(blank=True, null=True)
    recipes = models.ManyToManyField(ShoppingListRecipe, blank=True)
    entries = models.ManyToManyField(ShoppingListEntry, blank=True)
    shared = models.ManyToManyField(User, blank=True, related_name='list_share')
    finished = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Shopping list {self.id}'