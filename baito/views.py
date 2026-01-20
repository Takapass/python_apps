from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from .models import Shift
import json
from django.http import JsonResponse
from datetime import date

# Create your views here.


@login_required
def shift_month_api(request):
    year = int(request.GET.get("year"))
    month = int(request.GET.get("month"))

    shifts = Shift.objects.filter(
        user=request.user,
        date__year=year,
        date__month=month
    )

    data = {}

    for s in shifts:
        key = s.date.strftime("%Y-%m-%d")
        start = s.start_time.hour + s.start_time.minute / 60
        end = s.end_time.hour + s.end_time.minute / 60
        hours = end - start
        pay = hours * s.hourly_wage

        data.setdefault(key, []).append({
            "id": s.id,
            "start": s.start_time.strftime("%H:%M"),
            "end": s.end_time.strftime("%H:%M"),
            "hours": hours,
            "pay": pay,
            })

    return JsonResponse(data)


@login_required
def top(request):
    return render(request, "baito/top.html")


@login_required
def sift(request):
    shift_id = request.GET.get("id")
    shift = Shift.objects.filter(id=shift_id, user=request.user).first()

    if request.method == "POST":
        start = request.POST.get("start")
        end = request.POST.get("end")

        if not start or not end:
            return render(request, "baito/sift.html", {
                "shift": shift,
                "error": "開始時刻と終了時刻は必須です"
            })

        if shift:
            shift.date = request.POST["date"]
            shift.start_time = start
            shift.end_time = end
            shift.hourly_wage = request.POST["hourly_wage"]
            shift.save()
        else:
            Shift.objects.create(
                user=request.user,
                date=request.POST["date"],
                start_time=start,
                end_time=end,
                hourly_wage=request.POST["hourly_wage"],
            )

        return redirect("baito:top")

    return render(request, "baito/sift.html", {"shift": shift})


@login_required
def delete_shift(request, shift_id):
    Shift.objects.filter(id=shift_id, user=request.user).delete()
    return redirect("baito:top")


def login_view(request):
    if request.method == "POST":
        user = authenticate(
            request,
            username=request.POST["username"],
            password=request.POST["password"]
        )
        if user:
            login(request, user)
            return redirect("baito:top")

    return render(request, "baito/login.html")


def logout_view(request):
    logout(request)
    return redirect("baito:login")


def signup(request):
    return render(request, 'baito/signup.html')


def setting(request):
    return render(request, 'baito/setting.html')
