from django.db.models import Sum
import numpy as np
from django.db import transaction
from .models import Achats, Achat, Article, Contrat, TypeDachat, SituationDachat
from datetime import timedelta
from docx import Document
from datetime import datetime, timedelta
from django.conf import settings
import io
import base64
from rest_framework.decorators import api_view
from .models import Achats, Achat
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Achats, TypeDachat, TypeDArticle, Article, SituationDachat
from .serializers import AchatsSerializer, ProgressSerializer, PostDaSerializer, PostBCSerializer, PostBLSerializer, PostOBSerializer, FileSerializer
from .permissions import IsManagerAchatPermission
from rest_framework.throttling import UserRateThrottle
from datetime import datetime
from django.utils import timezone
from django.http import JsonResponse
import logging
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


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def download_achats_file(request):
    file_path = '/app/static/Achats.xlsx'
    with open(file_path, 'rb') as excel_file:
        response = HttpResponse(
            excel_file.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename="example.xlsx"'
        return response


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def download_article_file(request):
    file_path = '/app/static/Article.xlsx'
    with open(file_path, 'rb') as excel_file:
        response = HttpResponse(
            excel_file.read(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename="example.xlsx"'
        return response


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def ExcelExportView(request):
    achats = Achats.objects.all().prefetch_related('achat')
    params = request.query_params
    achats = Achats.objects.all()
    params = request.query_params

    if 'search' in params and len(params['search']) > 0:
        srch = params['search']
        print('enter', srch)
        achats = Achats.objects.filter(Q(demandeur=srch) | Q(entité=srch) | Q(
            ligne_bugetaire=srch) | Q(DA=srch) | Q(BC=srch) | Q(BL=srch))
    else:
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
        if 'isComplet' in params and params['isComplet'].lower() == 'true':
            achats = achats.filter(isComplet=False)
        if 'apple' in params and params['apple'].lower() == 'true':
            achats = achats.filter(apple=True)

        if 'consommable' in params and params['consommable'].lower() == 'true':
            achats = achats.filter(consommable=True)
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
        date = datetime.strptime(request.data.get('date'), "%Y-%m-%d").date()
        if is_ == 'DA':
            serializer = PostDaSerializer(data=data)
            if serializer.is_valid():
                DA = serializer.validated_data['code']
                DateDA = date
                achat = Achats.objects.get(id=id)
                achat.DA = DA
                print(DateDA, '******')
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
                DateBC = date
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
                achat = Achats.objects.get(id=id)
                if data.get('fournisseur'):
                    fournisseur = serializer.validated_data['fournisseur']
                    achat.fourniseur = fournisseur
                DateBL = date
                reste_data = serializer.validated_data['reste']
                achat.BL = BL
                achat.DateBL = DateBL
                if file_data:
                    achat.BL_File = file_path
                for item in reste_data:
                    achat_obj = Achat.objects.get(id=achat_id)
                    achat_id = item['id']
                    new_reste = int(item['reste'])
                    if new_reste > 0:
                        ResteCount = ResteCount + 1
                    achat_obj.reste = new_reste
                    valable = achat_obj.get('quanité') - new_reste
                    achat_obj.valable = valable
                    achat_obj.save()
                if ResteCount == 0:
                    achat.situation_d_achat = SituationDachat.objects.get(id=4)
                else:
                    achat.situation_d_achat = SituationDachat.objects.get(id=5)
                achat.save()
                return Response({"message": "Data is valid. Process it."})
            logger.exception(f'Error in saving Achats instance: {str(e)}')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif is_ == 'OB':
            serializer = PostOBSerializer(data=data)
            if serializer.is_valid():
                OB = serializer.validated_data['code']
                reste_data = serializer.validated_data['reste']
                achat = Achats.objects.get(id=id)
                achat.observation = OB
                for item in reste_data:
                    achat_obj = Achat.objects.get(id=achat_id)
                    achat_id = item['id']
                    new_reste = int(item['reste'])
                    if new_reste < 0:
                        new_reste = 0
                    if new_reste > 0:
                        ResteCount = ResteCount + 1
                    achat_obj.reste = new_reste
                    valable = achat_obj.get('quanité') - new_reste
                    achat_obj.valable = valable
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
        logger.exception(f'Error in creating Achats instance: {str(e)}')
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        Consommable = data.get('Consommable')
        apple = data.get('apple')
        date_obj = datetime.strptime(DateDeCommande, "%Y-%m-%d")
        Type_d_achat = data.get('typeDachat')
        achats_data = data.get('achats')
        if not (demandeur and isinstance(demandeur, str) and entite and isinstance(entite, str) and ligne_budgetaire and isinstance(ligne_budgetaire, str)
                and DateDeCommande and date_obj.time() == timezone.datetime.min.time() and isinstance(Consommable, bool) and isinstance(apple, bool) and Type_d_achat and isinstance(Type_d_achat, int) and achats_data):
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
                    article = Article.objects.filter(
                        designation=designation).first()
                    if not article:
                        typearticle, created = TypeDArticle.objects.get_or_create(
                            type=type_article)
                        article = Article.objects.create(
                            designation=designation, type=typearticle, prix_estimatif=int(prix_estimatif))
                    achat = Achat(article=article, quantité=int(
                        item.get('quantité')), reste=0, valable=0)
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
            consommable=Consommable,
            apple=apple
        )
        achats_instance.achat.set(achats)
        achats_instance.save()
        return Response("Commande added successfully", status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.exception(f'Error in creating Achats instance: {str(e)}')
        return Response({'message': f'Error in adding commande. {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

# @swagger_auto_schema(method='get', query_serializer=AchatFilterSerializer)


@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@api_view(['GET'])
@throttle_classes([UserRateThrottle])
def get_commandes(request):
    try:
        achats_list = []

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

        if 'isComplet' in params and params['isComplet'].lower() == 'true':
            achats = achats.filter(isComplet=False)

        if 'apple' in params and params['apple'].lower() == 'true':
            achats = achats.filter(apple=True)

        if 'consommable' in params and params['consommable'].lower() == 'true':
            achats = achats.filter(consommable=True)

        serializer = AchatsSerializer(achats, many=True)
        achats_list = serializer.data

        return Response(achats_list)

    except Exception as e:
        logger.exception(f'Error in retrieving achats data: {e}')
        return Response({'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_achat(request, id):
    try:
        achats = Achats.objects.get(id=id)
        serializer = AchatsSerializer(achats)
        achats_data = serializer.data
    except Achats.DoesNotExist:
        return Response({'message': 'Achats object not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': f'Error in retrieving achats data: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(achats_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
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
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
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
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def generate_word_file(request, id):
    from .models import Achats

    achats = Achats.objects.get(id=id)
    if achats.situation_d_achat.id == 4 or achats.situation_d_achat.id == 5:
        template_path = os.path.join(
            os.path.dirname(__file__),
            '../static/PV.docx' if achats.situation_d_achat.id == 4 else '../static/PV2.docx'
        )
        doc = Document(template_path)

        current_date = datetime.now()
        formatted_date = current_date.strftime("%d/%m/%Y")

        if achats.typeDachat.type != 'Accord Cadre':
            contrat = achats.fourniseur
        else:
            contrat = achats.achat.all()[0].article.contrat.name

        replacements = {
            "***": formatted_date,
            '+++': str(achats.BC),
            '+-+-': str(contrat),
        }

        for paragraph in doc.paragraphs:
            for key, value in replacements.items():
                if key in paragraph.text:
                    inline = paragraph.runs
                    for i in range(len(inline)):
                        if key in inline[i].text:
                            text = inline[i].text.replace(key, value)
                            inline[i].text = text
        new_file_path = os.path.join(os.path.dirname(
            __file__), '../static/pv/' + achats.BC + '.docx')
        doc.save(new_file_path)
        with open(new_file_path, 'rb') as file:
            response = HttpResponse(file.read(
            ), content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            response['Content-Disposition'] = 'attachment; filename="' + \
                achats.BC + '.docx"'
            return response


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
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
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
def types_with_total_quantity(request):
    types_with_quantities = TypeDArticle.objects.annotate(
        total_quantity=Sum('article__achat__quantité'))
    result = [{"x": type_with_quantity.type, "y": type_with_quantity.total_quantity}
              for type_with_quantity in types_with_quantities]
    return Response(result)


@permission_classes([IsAuthenticated, IsManagerAchatPermission])
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


@api_view(['POST'])
@throttle_classes([UserRateThrottle])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
def add_articles(request):
    if 'file' not in request.FILES:
        return Response({'message': 'No file was found'}, status=status.HTTP_400_BAD_REQUEST)

    excel_file = request.FILES['file']
    if not excel_file.name.endswith('.xlsx'):
        return Response({'message': 'Invalid file format. Please upload a .xlsx file.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        stream = io.BytesIO(excel_file.read())
        df = pd.read_excel(stream)

        df = df.replace({pd.NaT: None})
        df = df.replace({'Nan': None})
        df = df.replace({np.nan: None})

        contrat = excel_file.name
        Contrat.objects.get_or_create(name=contrat)
        for _, row in df.iterrows():
            if not Article.objects.filter(code=row['CODE']).exists():
                type_article, _ = TypeDArticle.objects.get_or_create(
                    type=str(row['type']) if row['type'] else "")
                contrat_instance = Contrat.objects.get(name=contrat)
                achats_instance = Article.objects.create(
                    code=str(row['CODE']) if row['CODE'] else "",
                    designation=str(row['designation']
                                    ) if row['designation'] else "",
                    type=type_article,
                    contrat=contrat_instance)

        return Response({'message': 'The data has been successfully imported.'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception(f'Error in saving Achats instance: {str(e)}')
        return Response({'message': f'Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


@throttle_classes([UserRateThrottle])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
def add_achats_file(request):
    if 'file' not in request.FILES:
        return Response({'message': 'No file was found'}, status=status.HTTP_400_BAD_REQUEST)
    excel_file = request.FILES['file']
    if not excel_file.name.endswith('.xlsx'):
        return Response({'message': 'Invalid file format. Please upload a .xlsx file.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        stream = io.BytesIO(excel_file.read())
        df = pd.read_excel(stream)
        df = df.replace({pd.NaT: None})
        df = df.replace({'Nan': None})
        df = df.replace({np.nan: None})
        current_one = datetime.strptime(
            datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d').date()
        for _, row in df.iterrows():
            achats_instance = Achats.objects.filter(
                DA=str(row['DA']).rstrip('.0')).first()
            if not achats_instance:
                # Date DA
                date_da_string = str(
                    row['Date DA']) if row['Date DA'] is not None else None
                clean_date_da_string = date_da_string.split(
                )[0] if date_da_string is not None else None
                DateDA = datetime.strptime(
                    clean_date_da_string, "%Y-%m-%d").date() if clean_date_da_string else None
                # Date de Commande
                if DateDA is not None:
                    current_one = DateDA
                date_de_commande_string = str(
                    row['Date de commande']) if row['Date de commande'] is not None else None
                clean_date_de_commande_string = date_de_commande_string.split(
                )[0] if date_de_commande_string is not None else None
                DateDeCommande = datetime.strptime(
                    clean_date_de_commande_string, "%Y-%m-%d").date() if clean_date_de_commande_string else current_one
                # Date BC
                date_bc_string = str(
                    row['Date BC']) if row['Date BC'] is not None else None
                clean_date_bc_string = date_bc_string.split(
                )[0] if date_bc_string is not None else None
                DateBC = datetime.strptime(
                    clean_date_bc_string, "%Y-%m-%d").date() if clean_date_bc_string else None
                # Date BL
                date_bl_string = str(
                    row['Date BL']) if row['Date BL'] is not None else None
                clean_date_bl_string = date_bl_string.split(
                )[0] if date_bl_string is not None else None
                DateBL = datetime.strptime(
                    clean_date_bl_string, "%Y-%m-%d").date() if clean_date_bl_string else None
                # situation
                situation = 1
                if row["Situation d'achat"] == 'Livré':
                    situation = 4
                else:
                    if row['DA']:
                        situation = 2
                        if row['BC']:
                            situation = 3
                            if row['BL']:
                                situation: 4
                                if row["Situation d'achat"] == 'Livraison partielle':
                                    situation = 5
                # achat infectation
                achats_instance = Achats.objects.create(
                    DA=str(row['DA']).rstrip('.0') if row['DA'] else "",
                    BC=str(row['BC']).rstrip('.0') if row['BC'] else "",
                    BL=str(row['BL']).rstrip('.0') if row['BL'] else "",
                    demandeur=row['Demandeur'],
                    entité=row['Entité'],
                    ligne_bugetaire=row['Ligne bugétaire'],
                    DateDeCommande=DateDeCommande,
                    typeDachat=TypeDachat.objects.get(
                        type=row["Type d'achat"]),
                    situation_d_achat=SituationDachat.objects.get(
                        id=situation),
                    DateDA=DateDA,
                    DateBC=DateBC,
                    DateBL=DateBL,
                    fourniseur=row['Fournisseur'] if row['Fournisseur'] else None,
                    apple=True if row['Apple'] and row['Apple'] == 'Apple' else False,
                    consommable=True if row['Consommable'] and row['Consommable'] == 'Consommable' else False,
                    observation=row['Observation'],
                )
                if situation == 4:
                    achats_instance.isComplet = True
            achats_instance.save()
            if row["Type d'achat"] == 'Accord Cadre':
                achat_code = str(row["Code"])
                if achat_code and isinstance(achat_code, str):
                    existing_article = Article.objects.filter(
                        code=achat_code).first()
            else:
                type = TypeDArticle.objects.get_or_create(type=row['Type'])
                new_article = Article.objects.create(
                    designation=row['Désignation'],
                    type=type,
                    prix_estimatif=row['Prix Estimatif']
                )
            achat = Achat.objects.create(
                quantité=row['Quantité'], valable=row['Quantité'] -
                (row['Reste'] if not pd.isna(row['Reste']) else 0),
                reste=row['Reste'] if not pd.isna(
                    row['Reste']) else 0,
                article=existing_article if existing_article else new_article
            )
            achats_instance.achat.add(achat)
        return Response({'message': 'The data has been successfully imported.'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception(f'Error in saving Achats instance: {str(e)}')
        return Response({'message': f'Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def dashboard_lines(request):
    try:
        achats = Achats.objects.all()
        achats = achats.filter(isComplet=False)
        TV = achats.filter(TV__gt=7, situation_d_achat=1)

        result_TV = []
        for achat in TV:
            weeks_count = round(achat.TV / 7)  # Round to the nearest integer
            result_TV.append(
                {

                    'achat_id': achat.id,
                    'weeks_count': weeks_count,
                    'demandeur': achat.demandeur,
                    'entité': achat.entité,
                    'DateDeCommande': achat.DateDeCommande,
                    'typeDachat': achat.typeDachat.type
                }
            )

        TT = achats.filter(situation_d_achat=2)
        TT = TT.filter(
            Q(typeDachat__id=1, TT__gt=7) | Q(typeDachat__id=4, TT__gt=8) |
            Q(typeDachat__id=2, TT__gt=14) |
            Q(typeDachat__id=3, TT__gt=28)
        )
        result_TT = []
        for achat in TT:
            weeks_count = round(achat.TT / 7)
            result_TT.append(
                {
                    'achat_id': achat.id,
                    'weeks_count': weeks_count,  # Use the rounded value directly
                    'achat_DA': achat.DA,
                }
            )

        TL = achats.filter(TL__gt=56, situation_d_achat=3)
        result_TL = []
        for achat in TL:
            weeks_count = round(achat.TL / 7)
            result_TL.append(
                {
                    'achat_id': achat.id,
                    'weeks_count': weeks_count,
                    'achat_DA': achat.DA,
                }
            )
        result = []
        result.append(
            {
                'TV': result_TV,
                'TT': result_TT,
                'TL': result_TL,
            }
        )
        return JsonResponse(result, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})
