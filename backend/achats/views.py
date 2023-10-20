import xlsxwriter
from datetime import datetime, timedelta
from django.conf import settings
import io
from .serializers import ProgressPostSerializer, FileSerializer
import base64
from rest_framework.decorators import api_view
from .models import Achats, Achat
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Achats, TypeDachat, TypeDArticle, Article, SituationDachat
from .serializers import AchatSerializer, AchatsSerializer, AchatFilterSerializer, AchatTSerializer, AchatsGSerializer, ProgressSerializer, PostDaSerializer, PostBCSerializer, PostBLSerializer, ProgressPostSerializer, PostOBSerializer
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
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def download_file(request, fl):
    try:
        if fl:
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
    achats = Achats.objects.all()
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
        'demandeur', 'entité', 'DateDeCommande', 'quantité', 'typeDachat__type', 'ligne_bugetaire', 'DA', 'DateDA', 'BC', 'DateBC', 'BL', 'DateBL', 'situation_d_achat__situation', 'article__designation', 'article__code', 'article__prix_estimatif', 'article__contrat__name', 'article__type__type', 'observation', 'reste')

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
        ResteCount = 0
        is_ = data.get('is_')
        # Access file directly from request data
        file_data = request.data.get('file')
        if is_ == 'DA':
            serializer = PostDaSerializer(data=data)
            if serializer.is_valid():
                DA = serializer.validated_data['code']
                DateDA = serializer.validated_data['date']
                achat = Achats.objects.get(id=id)
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
            serializer = PostBCSerializer(data=data)
            if serializer.is_valid():
                BC = serializer.validated_data['code']
                DateBC = serializer.validated_data['date']
                achat = Achats.objects.get(id=id)
                achat.BC = BC
                achat.DateBC = DateBC
                if file_data:
                    achat.BC_File = file_path
                print('dkhlat hna')
                achat.situation_d_achat = SituationDachat.objects.get(id=3)
                achat.save()
                return Response({"message": "Data is valid. Process it."})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif is_ == 'BL':
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
            serializer = PostBLSerializer(data=data)
            print(data)
            if serializer.is_valid():
                BL = serializer.validated_data['code']
                fournisseur = serializer.validated_data['fournisseur']
                DateBL = serializer.validated_data['date']
                reste_data = serializer.validated_data['reste']
                achat = Achats.objects.get(id=id)
                achat.BL = BL
                achat.fourniseur = fournisseur
                achat.DateBL = DateBL
                if file_data:
                    achat.BL_File = file_path
                for item in reste_data:
                    achat_id = item['id']
                    new_reste = int(item['reste'])
                    if new_reste > 0:
                        ResteCount = ResteCount + 1
                    achat_obj = Achat.objects.get(id=achat_id)
                    achat_obj.reste = new_reste
                    achat_obj.save()
                if ResteCount == 0:
                    achat.situation_d_achat = SituationDachat.objects.get(id=4)
                else:
                    achat.situation_d_achat = SituationDachat.objects.get(id=5)
                achat.save()
                return Response({"message": "Data is valid. Process it."})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif is_ == 'OB':
            serializer = PostOBSerializer(data=data)
            if serializer.is_valid():
                OB = serializer.validated_data['code']
                reste_data = serializer.validated_data['reste']
                achat = Achats.objects.get(id=id)
                achat.observation = OB
                for item in reste_data:
                    achat_id = item['id']
                    new_reste = int(item['reste'])
                    print(new_reste)
                    if new_reste > 0:
                        ResteCount = ResteCount + 1
                    achat_obj = Achat.objects.get(id=achat_id)
                    achat_obj.reste = new_reste
                    achat_obj.save()
                if ResteCount == 0:
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


@swagger_auto_schema(methods=['post'], request_body=AchatsGSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def add_commande(request):
    try:
        data = request.data
        demandeur = data.get('demandeur')
        entite = data.get('entité')
        ligne_budgetaire = data.get('ligne_bugetaire')
        DateDeCommande = data.get('DateDeCommande')
        date_obj = datetime.strptime(DateDeCommande, "%Y-%m-%d")
        Type_d_achat = data.get('typeDachat')
        achats_data = data.get('achats')
        if not (demandeur and isinstance(demandeur, str) and entite and isinstance(entite, str) and ligne_budgetaire and isinstance(ligne_budgetaire, str)
                and DateDeCommande and date_obj.time() == timezone.datetime.min.time() and Type_d_achat and isinstance(Type_d_achat, int) and achats_data):
            return Response("Invalid Data", status=status.HTTP_400_BAD_REQUEST)
        achats = []
        if Type_d_achat == 1:
            for item in achats_data:
                code = item.get('code')
                if code and isinstance(code, str):
                    article = Article.objects.filter(code=code).first()
                    if article:
                        achat = Achat(article=article,
                                      quantité=item.get('quantité'), reste=0)
                        achat.save()
                        achats.append(achat)
                    else:
                        return Response({'message': f'Article with code {code} not found.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            for item in achats_data:
                designation = item.get('designation')
                type_article = item.get('type')
                prix_estimatif = item.get('prix_estimatif')
                if designation and isinstance(designation, str) and type_article and isinstance(type_article, str) and prix_estimatif and isinstance(prix_estimatif, str):
                    typearticle, created = TypeDArticle.objects.get_or_create(
                        type=type_article)
                    article = Article.objects.create(
                        designation=designation, type=typearticle, prix_estimatif=int(prix_estimatif))
                    achat = Achat(article=article, quantité=int(
                        item.get('quantité')))
                    achat.save()
                    achats.append(achat)
                else:
                    return Response("Invalid Article Data", status=status.HTTP_400_BAD_REQUEST)
        situation = SituationDachat.objects.get(id=1)
        Type_d_achat_instance = TypeDachat.objects.get(id=Type_d_achat)
        achats_instance = Achats.objects.create(
            demandeur=demandeur,
            entité=entite,
            ligne_bugetaire=ligne_budgetaire,
            DateDeCommande=date_obj.date(),
            typeDachat=Type_d_achat_instance,
            situation_d_achat=situation,
        )
        achats_instance.achat.set(achats)
        achats_instance.save()

        return Response("Commande added successfully", status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'message': f'Error in adding commande. {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method='get', query_serializer=AchatFilterSerializer)
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@api_view(['GET'])
@throttle_classes([UserRateThrottle])
def get_commandes(request):
    achats_list = []  # Define an empty list
    try:
        achats = Achats.objects.all()
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
            achats = achats.filter(achat_article__type=params['typeDarticle'])
        if 'reste' in params and params['reste'].lower() == 'true':
            achats = achats.filter(achat__reste__gt=0)
        if 'isComplet' in params and params['isComplet'].lower() == 'true':
            achats = achats.filter(isComplet=False)

        # Get data from AchatsSerializer
        serializer = AchatsSerializer(achats, many=True)
        achats_list = serializer.data

    except Exception as e:
        return Response({'message': f'Error in retrieving achats data: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(achats_list)


@api_view(['GET'])
def get_achat(request, id):
    try:
        achats = Achats.objects.get(id=id)
        serializer = AchatTSerializer(achats)
        achats_data = serializer.data
    except Achats.DoesNotExist:
        return Response({'message': 'Achats object not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': f'Error in retrieving achats data: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(achats_data)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
# @throttle_classes([UserRateThrottle])
# def get_types_article(request):
#     types = TypeDArticle.objects.all()
#     types = types.values('type')
#     types_list = list(types)
#     return JsonResponse(types_list, safe=False)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_types_achat(request):
    print('helod')
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
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_progress(request, id):
    try:
        achats = Achats.objects.get(id=id)
        serializer = ProgressSerializer({
            'DA': achats.DA,
            'BC': achats.BC,
            'BL': achats.BL,
            'isComplet': achats.isComplet,
            'demandeur': achats.demandeur,
            'achats': achats.achat.all()
        })
        return Response(serializer.data)
    except Achats.DoesNotExist:
        return Response({'message': f'Achats with id {id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': f'Error in retrieving achats data: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def dashboard_header(request):
    try:
        n = 0
        ect = 0
        ecl = 0
        lp = 0
        achats = Achats.objects.all()
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
        achats = Achats.objects.all()
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
        achats = Achats.objects.all()
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
