from recipes.models import Recipe, Keyword, Food, Unit
from recipes.serializers import RecipeSerializer, KeywordSerializer, FoodSerializer, UnitSerializer
from rest_framework import viewsets, status, filters, permissions, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import QueryDict
import json
from djangorestframework_camel_case.parser import CamelCaseJSONParser

class MultipartJSONParser(parsers.MultiPartParser):

    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(
            stream,
            media_type=media_type,
            parser_context=parser_context
        )
        data = {}
        data = json.loads(result.data["data"])

        qdict = QueryDict('', mutable=True)
        qdict.update(data)
        print(qdict)
        return parsers.DataAndFiles(qdict, result.files)


class MultipartFormencodeParser(parsers.MultiPartParser):

    def parse(self, stream, media_type=None, parser_context=None):
        result = parsers.DataAndFiles, super().parse(
            stream,
            media_type=media_type,
            parser_context=parser_context
        )

        _data_keys: Set[str] = set(result.data.keys())
        _file_keys: Set[str] = set(result.files.keys())

        _intersect = _file_keys.intersection(_data_keys)
        if len(_intersect) > 0:
            raise ValidationError('files and data had intersection on keys: ' + str(_intersect))

        # merge everything together
        merged = QueryDict(mutable=True)

        merged.update(result.data)
        merged.update(result.files)  # type: ignore

        # decode it together
        decoded_merged = variable_decode(merged)

        parser_context['__JSON_AS_STRING__'] = True

        if len(result.files) > 0:
            # if we had at least one file put everything into files so we
            # later know we had at least one file by running len(request.FILES)
            parser_context['request'].META['REQUEST_HAD_FILES'] = True
            return parsers.DataAndFiles(decoded_merged, {})  # type: ignore
        else:
            # just put it into data, doesnt matter really otherwise
            return parsers.DataAndFiles(decoded_merged, {})  # type: ignore

class RecipeViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing recipe instances.
    """
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.filter(is_deleted=False).order_by('?')
    # parser_classes = [parsers.MultiPartParser, CamelCaseJSONParser]
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
