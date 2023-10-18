import xlsxwriter
from datetime import datetime, timedelta
from django.conf import settings
import io
from .serializers import ProgressPostSerializer, FileSerializer
import base64
from rest_framework.decorators import api_view
from .models import Achat
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Achat, TypeDachat, TypeDArticle, Article, SituationDachat
from .serializers import AchatSerializer, AchatFilterSerializer, ProgressSerializer, PostDaSerializer, PostBCSerializer, PostBLSerializer, ProgressPostSerializer, PostOBSerializer
from .permissions import IsManagerAchatPermission
from drf_yasg.utils import swagger_auto_schema
from rest_framework.throttling import UserRateThrottle
from datetime import datetime
from django.utils import timezone
from django.http import JsonResponse
import logging
from django.shortcuts import get_object_or_404
from django.db.models import Q
import os
from django.http import HttpResponse
import pandas as pd

logger = logging.getLogger(__name__)


class CustomObject:
    def __init__(self, code, date, is_, file):
        self.code = code
        self.date = date
        self.is_ = is_
        self.file = file


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
@api_view(['GET'])
def download_file(request, fl):
    try:
        if fl is not None or fl.size > 0:
            file_path = '/app/static/files/'
            with open(file_path + fl + '.pdf', 'rb') as file:
                response = HttpResponse(
                    file.read(), content_type='application/pdf')
                # Replace with the actual file name
                response['Content-Disposition'] = 'attachment; filename="' + fl + '.pdf"'

            return response
    except FileNotFoundError:
        return Response({"message": "File not found."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(method='get', query_serializer=AchatFilterSerializer)
@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def ExcelExportView(request):
    achats_list = []  # Define an empty list
    achats = Achat.objects.all()
    params = request.query_params
    if 'typeDachat' in params:
        achats = achats.filter(typeDachat=params['typeDachat'])
    if 'DA' in params:
        achats = achats.filter(DA=params['DA'])
    if 'BC' in params:
        achats = achats.filter(BC=params['BC'])
    if 'BL' in params:
        achats = achats.filter(BL=params['BL'])
    if 'situation_d_achat' in params:
        achats = achats.filter(
            situation_d_achat=params['situation_d_achat'])
    if 'typeDarticle' in params:
        achats = achats.filter(article__type=params['typeDarticle'])
    if 'reste' in params and params['reste'].lower() == 'true':
        achats = achats.filter(reste__gt=0)
    if 'isComplet' in params and params['isComplet'].lower() == 'true':
        achats = achats.filter(isComplet=False)  # Fixed this line
    achats = achats.select_related('article__contrat', 'article__type', 'typeDachat', 'situation_d_achat').values(
        'demandeur', 'entité', 'DateDeCommande', 'quantité', 'typeDachat__type', 'ligne_bugetaire', 'DA', 'DateDA', 'BC', 'DateBC', 'BL', 'DateBL', 'situation_d_achat__situation', 'article__designation', 'article__code', 'article__fourniseur', 'article__prix_estimatif', 'article__contrat__name', 'article__type__type', 'observation', 'reste')

    achats_list = list(achats)  # Convert queryset to list
    # Create a list of dictionaries including the related fields
    achats_with_related_fields = []
    for achat in achats_list:
        temp = {
            'Demandeur': achat['demandeur'],
            'Entité': achat['entité'],
            'Type': achat['article__type__type'],
            # "Code d'article": achat['article__code'],
            'Code d\'article': achat['article__code'] if achat['typeDachat__type'] == 'Contrat Cadre' else '',
            'Désignation': achat['article__designation'],
            'Quantité': achat['quantité'],
            'Ligne budgétaire': achat['ligne_bugetaire'],
            'Date De Commande': achat['DateDeCommande'],
            'DA': achat['DA'],
            'Date DA': achat['DateDA'],
            'BC': achat['BC'],
            'Date BC': achat['DateBC'],
            'Contrat': achat['article__contrat__name'] if achat['typeDachat__type'] == 'Contrat Cadre' else '',
            # 'Contrat': achat['article__contrat__name'],
            # 'Fournisseur': achat['article__fourniseur'],
            'Fournisseur': achat['article__fourniseur'] if achat['typeDachat__type'] != 'Contrat Cadre' else '',
            "Type d'achat": achat['typeDachat__type'],
            # 'Prix estimatif': achat['article__prix_estimatif'],
            'Prix estimatif': achat['article__prix_estimatif'] if achat['typeDachat__type'] != 'Contrat Cadre' else '',
            "Situation d'achat": achat['situation_d_achat__situation'],
            'BL': achat['BL'],
            'Date BL': achat['DateBL'],
            'Reste': achat['reste'],
            'Observation': achat['observation'],
        }
        achats_with_related_fields.append(temp)

    # Convert the list of dictionaries to a DataFrame
    df = pd.DataFrame(achats_with_related_fields)
    current_date_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="' + \
        current_date_time + '.xlsx"'

    writer = pd.ExcelWriter(response, engine='xlsxwriter')

    # Convert the dataframe to an XlsxWriter Excel object.
    df.to_excel(writer, index=False, sheet_name='Sheet1')

    # Get the xlsxwriter workbook and worksheet objects.
    workbook = writer.book
    worksheet = writer.sheets['Sheet1']

    # Set the column width and format the cells to wrap text.
    for i, col in enumerate(df.columns):
        column_len = max(df[col].astype(str).map(len).max(), len(col))
        # Adding extra space for padding
        worksheet.set_column(i, i, column_len + 2)
        worksheet.set_column(i, i, None, None, {'text_wrap': True})

    # Save the workbook.
    workbook.close()

    return response


MAX_FILE_SIZE = 10 * 1024 * 1024


@swagger_auto_schema(methods=['post'], request_body=ProgressPostSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def progress(request, id):
    try:
        data = request.data
        is_ = data.get('is_')
        # Access file directly from request data
        file_data = request.data.get('file')
        if is_ == 'DA':
            serializer = PostDaSerializer(data=data)
            if serializer.is_valid():
                DA = serializer.validated_data['code']
                DateDA = serializer.validated_data['date']
                achat = Achat.objects.get(id=id)
                achat.DA = DA
                achat.DateDA = DateDA
                achat.situation_d_achat = SituationDachat.objects.get(id=2)
                achat.save()
                return Response({"message": "Data is valid. Process it."})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif is_ == 'BC':
            if file_data:
                file_serializer = FileSerializer(data={'file': file_data})
                file_serializer.is_valid(raise_exception=True)
                if len(file_data) > MAX_FILE_SIZE:
                    return Response({"error": "File size exceeds the limit"}, status=status.HTTP_400_BAD_REQUEST)
                file_data = file_data.split(',', 1)[1]
                decoded_file = base64.b64decode(file_data)
                file_object = io.BytesIO(decoded_file)
                # Assuming 'MEDIA_ROOT' is your media directory
                file_path = os.path.join(
                    settings.MEDIA_ROOT, f"{data['code']}.pdf")
                with open(file_path, 'wb') as f:
                    f.write(file_object.getbuffer())
            else:
                return Response({"error": "File isn't exist!"}, status=status.HTTP_400_BAD_REQUEST)
            serializer = PostBCSerializer(data=data)
            if serializer.is_valid():
                BC = serializer.validated_data['code']
                DateBC = serializer.validated_data['date']
                achat = Achat.objects.get(id=id)
                achat.BC = BC
                achat.DateBC = DateBC
                achat.BC_File = file_path  # Save the file path to the model field
                achat.situation_d_achat = SituationDachat.objects.get(id=3)
                achat.save()
                return Response({"message": "Data is valid. Process it."})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif is_ == 'BL':
            file_serializer = FileSerializer(data={'file': file_data})
            file_serializer.is_valid(raise_exception=True)
            if file_data:
                if len(file_data) > MAX_FILE_SIZE:
                    return Response({"error": "File size exceeds the limit"}, status=status.HTTP_400_BAD_REQUEST)
                file_data = file_data.split(',', 1)[1]
                decoded_file = base64.b64decode(file_data)
                file_object = io.BytesIO(decoded_file)
                # Assuming 'MEDIA_ROOT' is your media directory
                file_path = os.path.join(
                    settings.MEDIA_ROOT, f"{data['code']}.pdf")
                with open(file_path, 'wb') as f:
                    f.write(file_object.getbuffer())
            serializer = PostBLSerializer(data=data)
            if serializer.is_valid():
                BL = serializer.validated_data['code']
                DateBL = serializer.validated_data['date']
                reste = serializer.validated_data['reste']
                achat = Achat.objects.get(id=id)
                achat.BL = BL
                achat.DateBL = DateBL
                achat.BL_File = file_path  # Save the file path to the model field
                achat.reste = reste
                if int(data.get('reste')) <= 0:
                    achat.situation_d_achat = SituationDachat.objects.get(id=4)
                else:
                    achat.situation_d_achat = SituationDachat.objects.get(id=5)
                achat.save()
                return Response({"message": "Data is valid. Process it."})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif is_ == 'OB':
            serializer = PostOBSerializer(data=data)
            print(data)
            if serializer.is_valid():
                print('hello')
                OB = serializer.validated_data['code']
                reste = serializer.validated_data['reste']
                achat = Achat.objects.get(id=id)
                achat.observation = OB
                achat.reste = reste
                if int(data.get('reste')) <= 0:
                    achat.situation_d_achat = SituationDachat.objects.get(id=4)
                    achat.isComplet = True
                else:
                    achat.situation_d_achat = SituationDachat.objects.get(id=5)
                achat.save()
                return Response({"message": "Data is valid. Process it."})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response('error', status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['post'], request_body=AchatSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def add_commande(request):
    try:
        data = request.data
        demandeur = data.get('demandeur')
        entité = data.get('entité')
        ligne_bugetaire = data.get('ligne_bugetaire')
        quantité = data.get('quantité')
        if (isinstance(quantité, str)):
            quantité = int(quantité)
        DateDeCommande = data.get('DateDeCommande')
        date_obj = datetime.strptime(DateDeCommande, "%Y-%m-%d")
        Type_d_achat = data.get('typeDachat')
        article_ = data.get('article')
        print(data)
        if not ((demandeur is not None and isinstance(demandeur, str))
                and (entité is not None and isinstance(entité, str))
                and (ligne_bugetaire is not None and isinstance(ligne_bugetaire, str))
                and (quantité is not None and isinstance(quantité, int))
                and (DateDeCommande is not None and date_obj.time() == timezone.datetime.min.time())
                and (Type_d_achat is not None and isinstance(Type_d_achat, int))
                and article_ is not None):
            return Response("1 Error Data", status=status.HTTP_400_BAD_REQUEST)
        if Type_d_achat == 1:
            code = article_.get('code')
            if code is not None and isinstance(code, str):
                code = code.strip()
                try:
                    article = Article.objects.filter(code=code).first()
                except Article.DoesNotExist:
                    print('here 1')
                    return Response({'message': 'Article not found.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                print('here 2')
                return Response("2 Error Data", status=status.HTTP_400_BAD_REQUEST)
        else:
            now = datetime.now()
            # Format the current time as a string
            timestamp = now.strftime("%Y%m%d%H%M%S")
            code = 'DSI' + timestamp
            designation = article_.get('designation')
            type_article = article_.get('type')
            fourniseur = article_.get('fourniseur')
            prix_estimatif = article_.get('prix_estimatif')
            if (designation is not None and isinstance(designation, str)) and (type_article is not None and isinstance(type_article, str)) \
                    and (fourniseur is not None and isinstance(fourniseur, str) and (prix_estimatif is not None and isinstance(prix_estimatif, str))):
                typearticle, created = TypeDArticle.objects.get_or_create(
                    type=type_article)
                try:
                    article = Article(
                        code=code,
                        designation=designation,
                        type=typearticle,
                        fourniseur=fourniseur,
                        prix_estimatif=int(prix_estimatif)
                    )
                    article.save()
                except Exception as e:
                    print(e)
            else:
                print('here 3')
                return Response("3 Error Data", status=status.HTTP_400_BAD_REQUEST)
        situation = SituationDachat.objects.get(id=1)
        Type_d_achat_instance = TypeDachat.objects.get(id=Type_d_achat)
        try:
            achat = Achat(
                article=article,
                demandeur=demandeur,
                entité=entité,
                ligne_bugetaire=ligne_bugetaire,
                quantité=quantité,
                DateDeCommande=date_obj,
                typeDachat=Type_d_achat_instance,  # Assign the instance, not the integer
                situation_d_achat=situation
            )
        except Exception as e:
            print(f"Error: {str(e)}")
        try:
            achat.save()
        except Exception as e:
            print('here 4')
            return Response({'**message': 'Article not found.'}, status=status.HTTP_400_BAD_REQUEST)
        print('here 5')
        return Response("ok", status=status.HTTP_201_CREATED)
    except Exception as e:
        print('here 6')
        return Response({'message': 'Article not found.'}, status=status.HTTP_400_BAD_REQUEST)
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method='get', query_serializer=AchatFilterSerializer)
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@api_view(['GET'])
@throttle_classes([UserRateThrottle])
def get_commandes(request):
    achats_list = []  # Define an empty list

    try:
        achats = Achat.objects.all()
        params = request.query_params
        if 'typeDachat' in params:
            achats = achats.filter(typeDachat=params['typeDachat'])
        if 'DA' in params:
            achats = achats.filter(DA=params['DA'])
        if 'BC' in params:
            achats = achats.filter(BC=params['BC'])
        if 'BL' in params:
            achats = achats.filter(BL=params['BL'])
        if 'situation_d_achat' in params:
            achats = achats.filter(
                situation_d_achat=params['situation_d_achat'])
        if 'typeDarticle' in params:
            achats = achats.filter(article__type=params['typeDarticle'])
        if 'reste' in params and params['reste'].lower() == 'true':
            achats = achats.filter(reste__gt=0)
        if 'isComplet' in params and params['isComplet'].lower() == 'true':
            achats = achats.filter(isComplet=False)  # Fixed this line
        achats = achats.select_related('article').values(
            'demandeur', 'entité', 'DateDeCommande', 'DA', 'situation_d_achat', 'id', 'article__designation', 'isComplet')
        achats_list = list(achats)
        print(achats_list)
    except Exception as e:
        print(e)

    return JsonResponse(achats_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_achat(request, id):
    achat = get_object_or_404(Achat, id=id)
    serializer = AchatSerializer(achat)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_types_article(request):
    types = TypeDArticle.objects.all()
    types = types.values('type')
    types_list = list(types)
    return JsonResponse(types_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_types_achat(request):
    types = TypeDachat.objects.all()
    types = types.values('id', 'type')
    types_list = list(types)
    return JsonResponse(types_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_situation_achat(request):
    types = SituationDachat.objects.all()
    types = types.values('id', 'situation')
    types_list = list(types)
    return JsonResponse(types_list, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_progress(request, id):
    achat = get_object_or_404(Achat, id=id)
    serializer = ProgressSerializer({
        'DA': achat.DA,
        'BC': achat.BC,
        'BL': achat.BL,
        'isComplet': achat.isComplet,
        'Designation': achat.article.designation,
        'demandeur': achat.demandeur,
        'reste': achat.reste
    })
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def dashboard_header(request):
    try:
        n = 0
        ect = 0
        ecl = 0
        lp = 0
        achats = Achat.objects.all()
        achats = achats.filter(isComplet=False)
        n = achats.filter(situation_d_achat=1).count()
        ect = achats.filter(situation_d_achat=2).count()
        ecl = achats.filter(situation_d_achat=3).count()
        lp = achats.filter(situation_d_achat=5).count()
        counts = {
            "n": n,
            "ect": ect,
            "ecl": ecl,
            "lp": lp
        }
        return Response(counts)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def dashboard_pie(request):
    try:
        v = 0
        nv = 0
        achats = Achat.objects.all()
        nv = achats.filter(isComplet=False).count()
        v = achats.filter(isComplet=True).count()
        counts = {
            "livre": v,
            "non_livre": nv,
        }
        return Response(counts)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def dashboard_line(request):
    try:
        achats = Achat.objects.all()
        achats = achats.filter(isComplet=False)
        today = datetime.now().date()

        eight_weeks_delta = timedelta(weeks=8)
        eight_weeks_from_now = today - eight_weeks_delta
        achats = achats.filter(DateBC__lt=eight_weeks_from_now)

        result = []
        for achat in achats:
            weeks_count = ((today - achat.DateBC) / 7)
            result.append(
                {
                    'achat_id': achat.id,
                    'weeks_count': int(str(weeks_count).split()[0]),
                    'achat_DA': achat.DA,
                }
            )

        return Response(result)

    except Exception as e:
        return Response({'error': str(e)})
