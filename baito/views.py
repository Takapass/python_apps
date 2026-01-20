from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from .models import Shift
from django.http import JsonResponse
from datetime import date


def signup(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        password2 = request.POST.get("password2")

        if not username or not password:
            return render(request, "baito/signup.html", {
                "error": "全て入力してください"
            })

        if password != password2:
            return render(request, "baito/signup.html", {
                "error": "パスワードが一致しません"
            })

        if User.objects.filter(username=username).exists():
            return render(request, "baito/signup.html", {
                "error": "そのユーザー名は既に使われています"
            })

        User.objects.create_user(
            username=username,
            password=password
        )

        return redirect("baito:login")

    return render(request, "baito/signup.html")


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
        date_val = request.POST.get("date")
        start = request.POST.get("start")
        end = request.POST.get("end")
        wage = request.POST.get("hourly_wage")

        if not start or not end:
            return render(request, "baito/sift.html", {
                "shift": shift,
                "error": "開始時刻と終了時刻は必須です"
            })

        if start >= end:
            return render(request, "baito/sift.html", {
                "shift": shift,
                "error": "終了時刻は開始時刻より後にしてください"
            })

        if shift:
            shift.date = date_val
            shift.start_time = start
            shift.end_time = end
            shift.hourly_wage = wage
            shift.save()
        else:
            Shift.objects.create(
                user=request.user,
                date=date_val,
                start_time=start,
                end_time=end,
                hourly_wage=wage,
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


def setting(request):
    return render(request, 'baito/setting.html')
