from django.db.models import Sum
import numpy as np
from django.db.models import Count
from django.db import transaction
from .models import Achats, Achat, Article, Contrat, TypeDachat, SituationDachat
from django.db import models
from datetime import timedelta
from django.db.models import Case, When, F, Value, DurationField
from docx import Document
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
    achats = Achats.objects.all().prefetch_related('achat')
    params = request.query_params
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
    if 'BCR' in params and params['BCR'].lower() == 'true':
        achats = apply_dynamic_filter(achats)
    if 'isComplet' in params and params['isComplet'].lower() == 'true':
        achats = achats.filter(isComplet=False)

    achats_data = []
    for achat in achats:
        for a in achat.achat.all():
            achat_data = {
                'Demandeur': achat.demandeur,
                'Entité': achat.entité,
                "Type": a.article.type,
                'Designation': a.article.designation,
                "Code d'article": a.article.code,
                'Quantité': a.quantité,
                'Ligne bugétaire': achat.ligne_bugetaire,
                'Prix Estimatif': a.article.prix_estimatif,
                'Date de commande': achat.DateDeCommande,
                'DA': achat.DA,
                'Date DA': achat.DateDA,
                'BC': achat.BC,
                'Date BC': achat.DateBC,
                'Fournisseur': achat.fourniseur,
                'Contrat': a.article.contrat,
                'Situation d\'achat': achat.situation_d_achat.situation,
                "Type d'achat": achat.typeDachat.type,
                'BL': achat.BL,
                'Date BL': achat.DateBL,
                'Observation': achat.observation,
                'Reste': a.reste,
            }
            achats_data.append(achat_data)

    df = pd.DataFrame(achats_data)
    current_date_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="' + \
        current_date_time + '.xlsx"'

    writer = pd.ExcelWriter(response, engine='xlsxwriter')

    df.to_excel(writer, index=False, sheet_name='Sheet1')

    workbook = writer.book
    worksheet = writer.sheets['Sheet1']

    for i, col in enumerate(df.columns):
        column_len = max(df[col].astype(str).map(len).max(), len(col))
        worksheet.set_column(i, i, column_len + 2)
        worksheet.set_column(i, i, None, None, {'text_wrap': True})

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
                        item.get('quantité')), reste=0)
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
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@api_view(['GET'])
@throttle_classes([UserRateThrottle])
def get_commandes(request):
    try:
        achats_list = []  # Initialize an empty list

        achats = Achats.objects.all()
        params = request.query_params

        # Apply filters based on the request parameters
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

        # Apply dynamic filter based on the 'typeDachat'
        if 'BCR' in params and params['BCR'].lower() == 'true':
            achats = apply_dynamic_filter(achats)

        # Apply additional filters
        if 'isComplet' in params and params['isComplet'].lower() == 'true':
            achats = achats.filter(isComplet=False)

        # Serialize the data
        serializer = AchatsSerializer(achats, many=True)
        achats_list = serializer.data

        return Response(achats_list)

    except Exception as e:
        logger.exception(f'Error in retrieving achats data: {e}')
        return Response({'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def apply_dynamic_filter(achats):
    today = timezone.now().date()

    one_day_delta = timedelta(weeks=1)
    four_weeks_delta = timedelta(weeks=4)
    two_weeks_delta = timedelta(weeks=2)
    achats = achats.filter(situation_d_achat=2)

    achat_o = achats.filter(
        Q(typeDachat__id=1) | Q(typeDachat__id=4, DateDA__lt=today - one_day_delta) |
        Q(typeDachat__id=2, DateDA__lt=today - two_weeks_delta) |
        Q(typeDachat__id=3, DateDA__lt=today - four_weeks_delta)
    )

    return achat_o


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
            'typeDachat': achats.typeDachat.id,
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


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def generate_word_file(request, id):
    from .models import Achats  # Adjust this import according to your project structure

    # Remove the prefetch_related as it is not needed for a single object
    achats = Achats.objects.get(id=id)

    # Load the existing Word template
    # Adjust the path to your template
    if achats.situation_d_achat.id == 4 or achats.situation_d_achat.id == 5:
        template_path = os.path.join(
            os.path.dirname(__file__),
            '../static/PV.docx' if achats.situation_d_achat.id == 4 else '../static/PV2.docx'
        )
        doc = Document(template_path)

        current_date = datetime.now()
        # Format the date as "dd/mm/yy"
        formatted_date = current_date.strftime("%d/%m/%Y")
        print(achats.situation_d_achat.id)

        # Change achats.get['typeDachat'] to achats.typeDachat

        if achats.typeDachat.type != 'Accord Cadre':
            contrat = achats.fourniseur
        else:
            contrat = achats.achat.all()[0].article.contrat.name

        # Define the words to be replaced
        replacements = {
            "***": formatted_date,
            '+++': str(achats.BC),
            # Make sure to convert to string if necessary
            '+-+-': str(contrat),
            # Add more words as needed
        }

        # Iterate through paragraphs and replace the defined words
        for paragraph in doc.paragraphs:
            for key, value in replacements.items():
                if key in paragraph.text:
                    inline = paragraph.runs
                    for i in range(len(inline)):
                        if key in inline[i].text:
                            text = inline[i].text.replace(key, value)
                            inline[i].text = text

        # Save the modified Word document
        # Adjust the path to save the modified file
        new_file_path = os.path.join(os.path.dirname(
            __file__), '../static/pv/' + achats.BC + '.docx')
        doc.save(new_file_path)

        # Return the generated file for download
        with open(new_file_path, 'rb') as file:
            response = HttpResponse(file.read(
            ), content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            response['Content-Disposition'] = 'attachment; filename="' + \
                achats.BC + '.docx"'
            return response


@throttle_classes([UserRateThrottle])
@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
def import_data_from_excel_to_db(request):
    df = pd.read_excel(os.path.join(
        os.path.dirname(__file__), '../static/test.xlsx'))
    df = df.replace({pd.NaT: None})
    df = df.replace({'Nan': None})
    df = df.replace({np.nan: None})
    for _, row in df.iterrows():
        achats_instance = Achats.objects.filter(
            DA=str(row['DA']).rstrip('.0')).first()
        if not achats_instance:
            achats_instance = Achats.objects.create(
                DA=str(row['DA']).rstrip('.0') if row['DA'] else "",
                BC=str(row['BC']).rstrip('.0') if row['BC'] else "",
                BL=str(row['BL']).rstrip('.0') if row['BL'] else "",
                demandeur=row['Demandeur'],
                entité=row['Entité'],
                ligne_bugetaire=row['Ligne bugétaire'],
                DateDeCommande=row['Date de commande'],
                typeDachat=TypeDachat.objects.get(type=row["Type d'achat"]),
                situation_d_achat=SituationDachat.objects.get(
                    situation=row["Situation d'achat"]),
                DateDA=row['Date DA'],
                DateBC=row['Date BC'],
                DateBL=row['Date BL'],
                observation=row['Observation'],
            )

            if row["Situation d'achat"] == 'Livré':
                achats_instance.isComplet = True
                achats_instance.save()

        achat_code = str(row["Code"])
        if achat_code and isinstance(achat_code, str):
            existing_article = Article.objects.filter(code=achat_code).first()
            if existing_article:
                achat = Achat.objects.create(
                    quantité=row['Quantité'],
                    reste=row['Reste'] if not pd.isna(row['Reste']) else 0,
                    article=existing_article
                )
                achats_instance.achat.add(achat)

    return Response({'message': 'The data has been successfully imported.'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def delete_achats(request, id):
    try:
        with transaction.atomic():
            achats_instance = Achats.objects.get(id=id)
            for achat_instance in achats_instance.achat.all():
                if not achat_instance.article.code:
                    try:
                        with transaction.atomic():
                            article_instance = achat_instance.article
                            achat_instance.delete()
                            article_instance.delete()
                    except Exception as e:
                        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    achat_instance.delete()
            achats_instance.delete()
    except Achats.DoesNotExist:
        return Response({"detail": "Achats not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"detail": "Achats deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@throttle_classes([UserRateThrottle])
def types_with_total_quantity(request):
    types_with_quantities = TypeDArticle.objects.annotate(
        total_quantity=Sum('article__achat__quantité'))
    result = [{"x": type_with_quantity.type, "y": type_with_quantity.total_quantity}
              for type_with_quantity in types_with_quantities]
    return Response(result)


# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@api_view(['GET'])
@throttle_classes([UserRateThrottle])
def search_commands(request):
    try:
        achats_list = []  # Initialize an empty list
        params = request.query_params
        print(params['search'])
        if 'search' in params:
            params = params['search']
            achats = Achats.objects.filter(Q(demandeur=params) | Q(entité=params) | Q(
                ligne_bugetaire=params) | Q(DA=params) | Q(BC=params) | Q(BL=params))
            serializer = AchatsSerializer(achats, many=True)
            achats_list = serializer.data
            return Response(achats_list)
        else:
            return Response({'message': 'Data not provided'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.exception(f'Error in retrieving achats data: {e}')
        return Response({'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
